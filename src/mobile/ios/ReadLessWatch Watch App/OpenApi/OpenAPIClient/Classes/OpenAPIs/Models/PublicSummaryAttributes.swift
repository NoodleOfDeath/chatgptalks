//
// PickSummaryAttributesExcludeKeyofSummaryAttributesRawTextOrFilteredText.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

/** From T, pick a set of properties whose keys are in the union K */
public struct PublicSummaryAttributes: Codable, Hashable {

  public var id: Int
  public var url: String
  public var title: String
  public var outletAttributes: PublicOutletAttributes?
  public var categoryAttributes: PublicCategoryAttributes?
  public var createdAt: Date?
  public var updatedAt: Date?
  public var deletedAt: Date?
  public var originalDate: Date?

  public init(id: Int,
              url: String,
              title: String,
              outletAttributes: PublicOutletAttributes? = nil,
              categoryAttributes: PublicCategoryAttributes? = nil,
              createdAt: Date? = nil,
              updatedAt: Date? = nil,
              deletedAt: Date? = nil,
              originalDate: Date? = nil) {
    self.id = id
    self.url = url
    self.title = title
    self.outletAttributes = outletAttributes
    self.categoryAttributes = categoryAttributes
    self.createdAt = createdAt
    self.updatedAt = updatedAt
    self.deletedAt = deletedAt
    self.originalDate = originalDate
  }

  public enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case url
    case title
    case outletAttributes
    case categoryAttributes
    case createdAt
    case updatedAt
    case deletedAt
    case originalDate
  }

  // Encodable protocol methods

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(id, forKey: .id)
    try container.encode(url, forKey: .url)
    try container.encode(title, forKey: .title)
    try container.encodeIfPresent(createdAt, forKey: .createdAt)
    try container.encodeIfPresent(updatedAt, forKey: .updatedAt)
    try container.encodeIfPresent(deletedAt, forKey: .deletedAt)
    try container.encodeIfPresent(originalDate, forKey: .originalDate)
  }
}

