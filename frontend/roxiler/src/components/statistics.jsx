import React, { useContext, useEffect, useState } from 'react';
import { Heading, chakra, Text, Center } from '@chakra-ui/react';
import axios from 'axios'
import { mycontext } from '../context';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Barchart from './barchart';

ChartJS.register(ArcElement, Tooltip, Legend);

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
    let [Statistics, setStatistics] = useState(null)
    let [barchart, setBarchart] = useState()

    useEffect(() => {
        fetchData(month)
            .then((res) => {
                setStatistics(res.statistics)
                setBarchart(res.barChart.barchart)
            })
    }, [month])

    return (
        <chakra.div mt={10} display={'flex'} gap={4} justifyContent={'space-evenly'} alignItems={'center'}>
            <div>
                <Heading display={'flex'} justifyContent={'center'} size={'md'} color={'blue.500'} >Statistics - {month == 0 ? <Text color={'red'}>Select any Month</Text> : ` ${Month[month - 1]}`}</Heading>
                <Center>
                    {
                        month == 0 ? <>---</> : <div>
                            {
                                Statistics != null &&
                                <chakra.div mt={4}>
                                    <Heading size={'md'} color={'red.500'} textAlign={'center'}>{`Total sale: Rs. ${Math.round(Statistics.totalSaleAmount)}`}</Heading>
                                    <Pie
                                        data={{
                                            labels: ['Total Sold Items', 'Total not sold Items'],
                                            datasets: [
                                                {
                                                    label: 'No. of Items',
                                                    data: [Statistics.soldItems, Statistics.unsoldItems],
                                                    backgroundColor: [
                                                        'rgba(255, 99, 132, 0.2)',
                                                        'rgba(54, 162, 235, 0.2)',
                                                    ],
                                                    borderColor: [
                                                        'rgba(255, 99, 132, 1)',
                                                        'rgba(54, 162, 235, 1)',
                                                    ],
                                                    borderWidth: 1,
                                                }

                                            ]
                                        }}
                                    />
                                </chakra.div>
                            }



                        </div>
                    }
                </Center>
            </div>
            <Barchart month={month} Month={Month} barchart={barchart} />






        </chakra.div>
    );
}

export default Statistics;
