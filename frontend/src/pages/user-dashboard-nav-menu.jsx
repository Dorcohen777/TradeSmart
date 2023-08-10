import { Link } from "react-router-dom";
// icons
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineInfoCircle } from "react-icons/ai";


export function UserboardNavBar() {

    return (
        <section className="user-dashboard-navbar-container">
            <h2><Link to={'/TradeSmart'} title="Home Page"> <AiOutlineHome/> </Link></h2>
            <h2><Link to={'/about-us'} title="About Us"> <AiOutlineInfoCircle/> </Link></h2>
        </section>
    )
}