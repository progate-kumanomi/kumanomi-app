import { defineStorage } from "@aws-amplify/backend"

export const storage = defineStorage({
    name: "room-images",
    access: (allow) => ({
        "rooms/*": [allow.guest.to(["read", "write"])],
    }),
})
