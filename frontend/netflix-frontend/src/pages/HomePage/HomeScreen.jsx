import { useAuthStore } from "../../store/authUser.js"


function HomeScreen() {

  const {logout} = useAuthStore()

  return (
    <div>HomeScreen {"   "}
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default HomeScreen