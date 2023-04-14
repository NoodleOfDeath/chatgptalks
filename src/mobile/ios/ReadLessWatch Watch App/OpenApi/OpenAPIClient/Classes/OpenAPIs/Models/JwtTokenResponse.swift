//
// JwtTokenResponse.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct JwtTokenResponse: Codable, JSONEncodable, Hashable {

    public var expiresAt: Double
    public var value: String
    public var priority: Double

    public init(expiresAt: Double, value: String, priority: Double) {
        self.expiresAt = expiresAt
        self.value = value
        self.priority = priority
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case expiresAt
        case value
        case priority
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(expiresAt, forKey: .expiresAt)
        try container.encode(value, forKey: .value)
        try container.encode(priority, forKey: .priority)
    }
}

