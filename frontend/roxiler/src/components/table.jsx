import React, { useContext, useEffect, useState } from 'react';
import {
    Center, Input, InputGroup, InputLeftElement, Select, chakra,
    Table,
    Th,
    Tbody, Thead, Tr, Td, Text, Button, Heading, Box
} from '@chakra-ui/react';
import { TriangleDownIcon, SearchIcon, AttachmentIcon } from '@chakra-ui/icons'
import { mycontext } from '../context';
import axios from 'axios'

let fetchData = async (query, page, month) => {
    try {
        let response = await axios(`${process.env.REACT_APP_BASE_URL}/api/transaction?search=${query}&page=${page}&month=${month}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}
const header = ["ID", "Title", "Description", "Price", "Category", "Sold", "Image"];

const TTable = () => {
    let { month, setMonth } = useContext(mycontext)
    let [query, setQiery] = useState("")
    let [page, setPage] = useState(1)
    let [transactions, setTransactions] = useState([])

    useEffect(() => {
        fetchData(query, page, month)
            .then((res) => {
                setTransactions(res.transactions)
            })
    }, [query, page, month])

    return (
        <chakra.div mt={4}>
            <Box position={'sticky'} zIndex={1} bg={'white'} top={0} p={4}>
                <chakra.div display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                    <InputGroup maxW={'250px'}>
                        <InputLeftElement pointerEvents='none'>
                            <SearchIcon color='gray.300' />
                        </InputLeftElement>
                        <Input onChange={(e) => {
                            setQiery(e.target.value)
                        }} focusBorderColor='blue.500' type='text' placeholder='Search Transaction' />
                    </InputGroup>
                    <chakra.div display={'flex'} gap={4}>
                        <Button isDisabled={page <= 1} onClick={() => {
                            setPage(page - 1)
                        }} w={'150px'} colorScheme={'blue'} variant={'outline'}>Previous</Button>
                        <Button w={'150px'} colorScheme={'blue'} variant={'outline'}>{page}</Button>
                        <Button isDisabled={transactions.length < 10} onClick={() => {
                            setPage(page + 1)
                        }} w={'150px'} colorScheme={'blue'} variant={'outline'}>Next</Button>
                        <Select onChange={(e) => {
                            setMonth(e.target.value)
                        }} focusBorderColor='blue.500' defaultValue={month} icon={<TriangleDownIcon />} >
                            <option value={0}>All</option>
                            <option value={1}>Jan</option>
                            <option value={2}>Feb</option>
                            <option value={3}>Mar</option>
                            <option value={4}>Apr</option>
                            <option value={5}>May</option>
                            <option value={6}>Jun</option>
                            <option value={7}>Jul</option>
                            <option value={8}>Aug</option>
                            <option value={9}>Sep</option>
                            <option value={10}>Oct</option>
                            <option value={11}>Nov</option>
                            <option value={12}>Dec</option>
                        </Select>
                    </chakra.div>

                </chakra.div>
            </Box>

            <Center>
                {
                    transactions.length == 0 ? <Heading mt={4} color={'blue.500'} size={'md'}> No Data Available.</Heading>
                        :
                        <Table mt={10} borderRadius={10} boxShadow={'base'}>
                            <Thead>
                                <Tr>
                                    {
                                        header.map((el, ind) => {
                                            return <Th fontWeight={'bolder'} key={ind}>{el}</Th>
                                        })
                                    }

                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    transactions.map((el, ind) => {
                                        return <Tr bg={ind % 2 == 0 && 'blue.50'} key={ind}>
                                            <Td>{ind + 1}</Td>
                                            <Td>{el.title}</Td>
                                            <Td ><Text noOfLines={3}>{el.description}</Text></Td>
                                            <Td>{el.price}</Td>
                                            <Td>{el.category}</Td>
                                            <Td>{el.sold ? "Sold" : "Not Sold"}</Td>
                                            <Td><chakra.a target='_blank' href={el.image}><AttachmentIcon /></chakra.a> </Td>
                                        </Tr>
                                    })
                                }
                            </Tbody>
                        </Table>
                }
            </Center>


        </chakra.div>
    );
}

export default TTable;
