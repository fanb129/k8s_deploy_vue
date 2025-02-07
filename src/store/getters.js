const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  u_id: state => state.user.u_id,
  username: state => state.user.username,
  email: state => state.user.email,
  g_id: state => state.user.g_id
}
export default getters
