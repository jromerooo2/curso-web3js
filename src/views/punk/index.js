import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    useToast,
    Tag,
  } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-access";
  import PunkCard from "../../components/punk-card";
  import { useMyPunkData } from "../../hooks/useMyPunksData";
  import { useParams } from "react-router-dom";
  import Loading from "../../components/loading";
 import { useState } from "react"; 
import useMyPunks from "../../hooks/useMyPunks";

  const Punk = () => {
    const { active, account,library } = useWeb3React();
    const { tokenId } = useParams();
    const myPunks = useMyPunks();
    const { loading, punk,update } = useMyPunkData(tokenId);

    const toast = useToast();
    const [transfering, setTransfering] = useState(false);
    const transfer = () => {
        setTransfering(true);
        const address = prompt("A quien desea transferir el punk?");
        const isAddress = library.utils.isAddress(address);

        if (!isAddress) {
            toast({
              title: "Error",
              description: "La dirección no es válida en Ethereum",
              status: "error",
              isClosable: true,
            })
            setTransfering(false);
        }else{
          myPunks.methods.safeTransferFrom(
            punk.owner, 
            address, 
            tokenId).send({from: account})
            .on('transactionHash', (hash) => {
              toast({
                title: "Transferencia en proceso",
                description: "Transaction hash: " + hash,
                status: "info",
                duration: 9000,
                isClosable: true,
              })
            })
            .on('error', (error) => {
              setTransfering(false);
            })
            .on('receipt', (receipt) => {
              setTransfering(false);
              toast({
                title: "Transferencia en proceso",
                description: `El punk ha sido transferido a ${address}`,
                status: "success",
                duration: 9000,
                isClosable: true,
              })
              update()              
            })
        }

    }
  
    if (!active) return <RequestAccess />;
  
    if (loading) return <Loading />;
  
    return (
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <PunkCard
            mx={{
              base: "auto",
              md: 0,
            }}
            name={punk.name}
            image={punk.image}
          />
          <Button
          onClick={transfer}
          disabled={account !== punk.owner} colorScheme="green"
          isLoading={transfering}>
            {account !== punk.owner ? "No eres el dueño" : "Transferir"}
          </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
          <Heading>{punk.name}</Heading>
          <Text fontSize="xl">{punk.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2}
            wordBreak="break-all"
             colorScheme="green">
              { punk.dna }
          </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme="green">
              {punk.owner}
            </Tag>
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Atributo</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>

            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    );
  };
  
  export default Punk;