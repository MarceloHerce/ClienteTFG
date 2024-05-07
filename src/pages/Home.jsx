import Header from "../components/Header";
import App from "../App";
import Login from "../GoogleLogin";
import CaptureScreen from "../components/Button";
function Home() {
    return (
        <>
            <Header></Header>
            <App />
            <Login></Login>
            <CaptureScreen></CaptureScreen>
        </>
    )
}


export default Home;