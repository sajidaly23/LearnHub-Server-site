// placeholder: business logic for storing/handling chat messages (if persisted)
export const saveMessage = async (fromId: string, toId: string, content: string) => {
  // store in DB if you add message model
  return { from: fromId, to: toId, content, createdAt: new Date() };
};