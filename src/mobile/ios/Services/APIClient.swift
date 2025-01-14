//
//  ConnectService.swift
//  ReadLessWatch Watch App
//
//  Created by tmorgan on 4/13/23.
//

import SwiftUI

struct ENDPOINTS {
  static let Root = "https://api.readless.ai/v1"
  static let GetSummaries = "\(Root)/summary"
  static let GetTopStories = "\(Root)/summary/top"
  static let GetCategories = "\(Root)/category"
}

func parseQuery(endpoint: String = ENDPOINTS.GetSummaries, filter: String?) -> URL? {
  guard 
    let filter = filter?.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed),
    filter.count > 0
    else { return URL(string: endpoint) }
  return URL(string: endpoint + "?filter=\(filter)")
}

class APIClient: ObservableObject {
  @Published var loading = false
  @Published var error: String?
  
  var decoder: JSONDecoder {
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .custom { (decoder) -> Date in
      let container = try decoder.singleValueContainer()
      let dateString = try container.decode(String.self)
      let dateFormatter = DateFormatter()
      dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
      dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
      if let date = dateFormatter.date(from: dateString) {
        return date
      }
      dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
      if let date = dateFormatter.date(from: dateString) {
        return date
      }
      throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date format")
    }
    return decoder
  }

  func fetchHandler(_ data: Data?) -> [Summary] {
    var summaries: [Summary] = []
    if let data = data {
      do {
        let decodedResponse = try decoder.decode(BulkResponse<PublicSummaryAttributes>.self, from: data)
        summaries = decodedResponse.rows.map { Summary($0) }
      } catch {
        print(error)
        self.error = error.localizedDescription
      }
    }
    self.loading = false
    return summaries
  }
  
  @Sendable func fetchSync() {
    return self.fetchSync(nil)
  }
  
  @Sendable func fetchSync(endpoint: String = ENDPOINTS.GetSummaries, filter: String? = "", _ callback: ((_ summaries: [Summary]) -> ())?) {
    guard let url = parseQuery(endpoint: endpoint, filter: filter) else {
      return
    }
    loading = true
    error = nil
    let request = URLRequest(url: url)
    URLSession.shared.dataTask(with: request) { (data, _, _) in
      DispatchQueue.main.async {
        let summaries = self.fetchHandler(data)
        callback?(summaries)
      }
    }.resume()
  }
  
  @Sendable func fetchAsync(endpoint: String = ENDPOINTS.GetSummaries, filter: String? = "") async -> [Summary] {
    guard let url = parseQuery(endpoint: endpoint, filter: filter) else {
      return []
    }
    loading = true
    error = nil
    let request = URLRequest(url: url)
    guard let (data, _) = try? await URLSession.shared.data(for: request) else {
      return []
    }
    return self.fetchHandler(data)
  }
  
  @Sendable func getCategories() async -> [PublicCategoryAttributes] {
    guard let url = URL(string: ENDPOINTS.GetCategories) else { return [] }
    print("fetching categories")
    let request = URLRequest(url: url)
    guard let (data, _) = try? await URLSession.shared.data(for: request) else {
      return []
    }
    print("fetched categories")
    do {
      let decodedResponse = try decoder.decode(BulkResponse<PublicCategoryAttributes>.self, from: data)
      print(decodedResponse.rows)
      return decodedResponse.rows
    } catch {
      print(error)
    }
    return []
  }
  
}
