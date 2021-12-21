import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import usemyPunks from "../../hooks/useMyPunks";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const { active, account } = useWeb3React();
  const myPunks = usemyPunks();
  const toast = useToast();

  const getmyPunksData = useCallback(async () => {
    if (myPunks) {
      const totalSupply = await myPunks.methods.totalSupply().call();
      const dnaPreview = await myPunks.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const image = await myPunks.methods.imageByDna(dnaPreview).call();
      setImageSrc(image);
    }
  }, [myPunks, account]);


  useEffect(() => {
    getmyPunksData();
  }, [getmyPunksData]);

  const mint = ()=>{
    setIsMinting(true);

    myPunks.methods.mint().send({from: account})
    .on("transactionHash", (hash)=>{
      toast({
        title: 'Transacción Enviada.',
        description: hash,
        status: 'info',
      })
    })
    .on("receipt", ()=>{
      setIsMinting(false);
      toast({
        title: 'Transacción Confirmada.',
        description: "Tu Punk ha sido creado🎸.",
        status: 'success',
      })
    })
    .on("error", (error)=>{
      setIsMinting(false);
      toast({
        title: 'Transacción Erronea.',
        description: error.message,
        status: 'error',
      })
    })
  }

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "pink.300",
              zIndex: -1,
            }}
          >
            Un MyPunk
          </Text>
          <br />
          <Text as={"span"} color={"green.300"}>
            Jamás para de bellakear.
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          MyPunks es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay 10,000
          en existencia.
        </Text>
        <Text color={"gray.500"}>
          Cada MyPunk se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu MyPunk si
          minteas en este momento.
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            onClick={mint}
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"pink.400"}
            _hover={{ bg: "yellow.500" }}
            disabled={!myPunks}
            isLoading={isMinting}
          >
            Obtén tu punk
          </Button>
          <Link to="/punks">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getmyPunksData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;