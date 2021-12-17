import { useWeb3React } from "@web3-react/core";
import { useState,useCallback,useEffect } from "react";
import useMyPunks from "../../hooks/useMyPunks";



const Home = () => {
  const { active } = useWeb3React();
  const [maxSupply, setMaxSupply] = useState(0);
  const myPunks = useMyPunks();

  const getMaxSupply = useCallback(
    async() => {
      if(myPunks) {
      const result = await myPunks.methods.MaxSupply().call();
      setMaxSupply(result);
      }
    },
    [myPunks],
  )

  useEffect(() => {
    getMaxSupply();
  }, [getMaxSupply])

  if(!active) return "Conecta Tu Wallet";

  return (
    <>
      <p>Max Supply : {maxSupply}</p>
    </>
  );
};

export default Home;
