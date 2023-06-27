import React, { useContext, useEffect, useState } from 'react';
import { Heading, chakra, Text, Center } from '@chakra-ui/react';
import axios from 'axios'
import { mycontext } from '../context';

let fetchData = async (month) => {
    try {
        let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/combined_data?month=${month}`)
        return res.data
    } catch (error) {
        return error
    }
}
let Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


const Statistics = () => {
    let { month } = useContext(mycontext)
    let [Statistics, setStatistics] = useState()
    let [barchart, setBarchart] = useState()

    useEffect(() => {
        fetchData(month)
            .then((res) => {
                console.log(res.statistics)
                setStatistics(res.statistics)
                setBarchart(res.barChart.barchart)
            })
    }, [month])

    return (
        <chakra.div mt={10}>
            <Heading display={'flex'} justifyContent={'center'} size={'md'} color={'blue.500'} >Statistics - {month == 0 ? <Text color={'red'}>Select any Month</Text> : ` ${Month[month - 1]}`}</Heading>
            <Center>
                {
                    month == 0 ? <>---</> : <>

                    </>
                }
            </Center>


        </chakra.div>
    );
}

export default Statistics;
