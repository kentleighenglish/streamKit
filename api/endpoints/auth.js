export const login = async (request) => {
  const { username } = request.body;

  const other = await new Promise((resolve) => resolve([]));

  return { username, other };
};
