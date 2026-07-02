import enum

class RoleEnum(str, enum.Enum):
    farmer = "farmer"
    owner = "owner"

class MembershipPlanEnum(str, enum.Enum):
    basic = "basic"
    prime = "prime"

class StorageTypeEnum(str, enum.Enum):
    commercial = "commercial"
    peer_to_peer = "peer_to_peer"
    government = "government"

class BookingStatusEnum(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"
    checked_in = "checked_in"
    checked_out = "checked_out"
    expired = "expired"

class EscrowStatusEnum(str, enum.Enum):
    pending_payment = "pending_payment"
    held = "held"
    released = "released"
    refunded = "refunded"

class NotificationTypeEnum(str, enum.Enum):
    alert = "alert"
    payment = "payment"
    booking = "booking"
    system = "system"
