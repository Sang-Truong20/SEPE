export const createAuthSlice = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: !!user,
      error: null,
    })),

  startLoading: () => set(() => ({ isLoading: true })),

  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
      error: null,
    })),
});
