import { Button } from "antd";

const HeaderBar = () => {
    return (
        <div style={{ display: "flex", justifyContent: "flex-start", padding: "10px" }}>
            <div>
                <Button>下线</Button>
                <Button>结束</Button>
                <Button>挂起</Button>
            </div>
        </div>
    )
}

export default HeaderBar;