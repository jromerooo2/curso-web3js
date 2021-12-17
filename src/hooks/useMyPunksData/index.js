import { useState, useCallback,useEffect } from "react"
import useMyPunks  from "../useMyPunks"

const getPunkData = async({
    myPunks, tokenId,
}) => {
    const [tokenURI, dna, owner,accessories,
           clotheColor,clotheType,eyeType,
            eyeBrowType,facialHairColor,facialHairType,
            hairColor,hatColor,graphicType,
            mouthType,skinColor] = await Promise.all([

        //all smart contract's methods
        myPunks.methods.tokenURI(tokenId).call(),
        myPunks.methods.tokenDNA(tokenId).call(),
        myPunks.methods.ownerOf(tokenId).call(),
        myPunks.methods.getAccessoriesType(tokenId).call(),
        myPunks.methods.getClotheColor(tokenId).call(),
        myPunks.methods.getClotheType(tokenId).call(),
        myPunks.methods.getEyeType(tokenId).call(),
        myPunks.methods.getEyeBrowType(tokenId).call(),
        myPunks.methods.getFacialHairColor(tokenId).call(),
        myPunks.methods.getFacialHairType(tokenId).call(),
        myPunks.methods.getHairColor(tokenId).call(),
        myPunks.methods.getHatColor(tokenId).call(),
        myPunks.methods.getGraphicType(tokenId).call(),
        myPunks.methods.getMouthType(tokenId).call(),
        myPunks.methods.getSkinColor(tokenId).call()


    ])
    const resMetadata = await fetch(tokenURI)
    const metadata = await resMetadata.json()


    return {
        tokenId,
        attributes : {
           accessories,
           clotheColor,
           clotheType,eyeType,
           eyeBrowType,
           facialHairColor,
           facialHairType,
           hairColor,
           hatColor,
           graphicType,
           mouthType,
           skinColor
        },
        tokenURI,
        dna,
        owner,
        ...metadata
    }
}

const useMyPunksData = () => {

    const[punks,setPunks] = useState([]);

    const[loading,setLoading] = useState(true);
    const myPunks = useMyPunks();

    const update = useCallback(async()=>{
        if(myPunks){
            setLoading(true)
            let tokenIds;

            const totalSupply =  await myPunks.methods.totalSupply().call();
            tokenIds = Array(Number(totalSupply)).fill().map((_,i)=>i);

            const punksPromise = tokenIds.map((tokenId)=>
                getPunkData({myPunks,tokenId})
            )

            const punks = await Promise.all(punksPromise)

            setPunks(punks)
            setLoading(false)
        }


    }, [myPunks])

    useEffect(() => {
        update()
    }, [update])

    return {
        punks,
        loading,
        update,
    }
}

const useMyPunkData = (tokenId = null) => {
    const [punk, setPunk] = useState({});
    const [loading, setLoading] = useState(true);
    const myPunks = useMyPunks();
  
    const update = useCallback(async () => {
      if (myPunks && tokenId !== null) {
        setLoading(true);
  
        const toSet = await getPunkData({ myPunks,tokenId });
        setPunk(toSet);

        setLoading(false);
      }
    }, [myPunks, tokenId]);
  
    useEffect(() => {
      update();
    }, [update]);
  
    return {
      loading,
      punk,
      update,
    };
}
export { useMyPunksData, useMyPunkData };