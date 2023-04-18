//
// DestroyResponse.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct DestroyResponse: Codable, JSONEncodable, Hashable {

    public var success: Bool

    public init(success: Bool) {
        self.success = success
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case success
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(success, forKey: .success)
    }
}
