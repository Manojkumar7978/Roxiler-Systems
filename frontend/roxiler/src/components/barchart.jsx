import React, { useContext, useEffect, useState } from 'react';
import { Center, chakra, Heading, Text } from '@chakra-ui/react';
import { mycontext } from '../context';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);



const Barchart = ({ month, Month, barchart }) => {

    let [chartArray, setChartArray] = useState([])
    console.log(barchart)
    useEffect(() => {
        let x = new Array(10).fill(0)

        if (barchart != undefined) {
            barchart.map((el, ind) => {
                switch (el.priceRange) {
                    case 0: x[0] = el.count
                        break;
                    case 101: x[1] = el.count
                        break;
                    case 201: x[2] = el.count
                        break;
                    case 301: x[3] = el.count
                        break;
                    case 401: x[4] = el.count
                        break;
                    case 501: x[5] = el.count
                        break;
                    case 601: x[6] = el.count
                        break;
                    case 701: x[7] = el.count
                        break;
                    case 801: x[8] = el.count
                        break;
                    case 901: x[9] = el.count
                        break;
                }
            })
        }
        setChartArray([...x])

    }, [barchart])





    return (
        <chakra.div>
            <Heading display={'flex'} justifyContent={'center'} size={'md'} color={'blue.500'} >Bar Chart Stats - {month == 0 ? <Text color={'red'}>Select any Month</Text> : ` ${Month[month - 1]}`}</Heading>
            <Center>
                {
                    month == 0 ? <>---</> : <>
                        <chakra.div w={'500px'}>
                            <Bar options={{
                                responsive: true,
                            }}
                                data={
                                    {
                                        labels: ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901+'],
                                        datasets: [

                                            {
                                                label: 'No. of items',
                                                data: chartArray.map((el, ind) => el),
                                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                            },
                                        ],
                                    }
                                } />
                        </chakra.div >
                    </>
                }

            </Center>

        </chakra.div>
    );
}

export default Barchart;
