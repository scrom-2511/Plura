import { createClient } from "redis";

export const client = createClient();

/**
 * Connects the Redis client if not already connected.
 * 
 * @return {Promise<void>} - Resolves when connection is established.
 */
export const connectClient = async (): Promise<void> => {
  // Validate client state and connect only if not open
  if (!client.isOpen) {
    await client.connect();
  }
};
