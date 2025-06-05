import Mapa from "./Mapa";
import GetFacilities from "../Gets/GetFacilities";


export default function AllFacilitiesMap(props) {
    const LocalMap = (props) => {
        return <Mapa points={props.data.map((e, i) =>
        ({
            nome: e.nickname,
            coords: [e.location.latitude, e.location.longitude]
        })
        )} />
    }

    return <div>
        <GetFacilities facilityID={props.facilityID}>
            <LocalMap   />
        </GetFacilities>
    </div>
}