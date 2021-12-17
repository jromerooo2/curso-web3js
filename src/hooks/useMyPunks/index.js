import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import MyPunksArtifact from "../../config/web3/artifacts/MyPunks";

const { address, abi } = MyPunksArtifact;
const useMyPunks = () => {
    const { active, library, chainId } = useWeb3React();

    const myPunks = useMemo( 
        () => {
            if(active) return new library.eth.Contract(abi, address[chainId])
        },[active, chainId, library?.eth?.Contract]);
        
        return myPunks;
}

export default useMyPunks;