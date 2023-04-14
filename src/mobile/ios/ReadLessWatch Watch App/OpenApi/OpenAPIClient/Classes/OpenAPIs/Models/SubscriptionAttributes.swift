//
// SubscriptionAttributes.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct SubscriptionAttributes: Codable, JSONEncodable, Hashable {

    public var deletedAt: Date?
    public var updatedAt: Date?
    public var createdAt: Date?
    public var id: Double
    public var newsletterId: Double
    public var alias: String
    public var aliasType: String

    public init(deletedAt: Date? = nil, updatedAt: Date? = nil, createdAt: Date? = nil, id: Double, newsletterId: Double, alias: String, aliasType: String) {
        self.deletedAt = deletedAt
        self.updatedAt = updatedAt
        self.createdAt = createdAt
        self.id = id
        self.newsletterId = newsletterId
        self.alias = alias
        self.aliasType = aliasType
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case deletedAt
        case updatedAt
        case createdAt
        case id
        case newsletterId
        case alias
        case aliasType
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(deletedAt, forKey: .deletedAt)
        try container.encodeIfPresent(updatedAt, forKey: .updatedAt)
        try container.encodeIfPresent(createdAt, forKey: .createdAt)
        try container.encode(id, forKey: .id)
        try container.encode(newsletterId, forKey: .newsletterId)
        try container.encode(alias, forKey: .alias)
        try container.encode(aliasType, forKey: .aliasType)
    }
}

