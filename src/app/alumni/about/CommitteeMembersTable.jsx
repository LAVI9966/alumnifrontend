import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeProvider';
const CommitteeMembersTable = () => {
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    const dummy = "https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg";
    const committeeMembers = [
        {
            id: 1,
            rank: 'Lt Gen',
            name: 'Adosh Kumar, PVSM, AVSM, SM',
            appointment: 'Hony President',
            contact: '9711435012',
            email: 'adoshkumar@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 2,
            rank: 'Lt Gen',
            name: 'BS Pawar, PVSM, AVSM',
            appointment: 'Member',
            contact: '9999843425',
            email: 'ballipawar@yahoo.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 3,
            rank: 'Lt Gen',
            name: 'SK Singh, PVSM, UYSM, AVSM',
            appointment: 'Member',
            contact: '8130011401',
            email: 'sksinghaft1806@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 4,
            rank: 'Cmde',
            name: 'NAJ Joseph, VSM',
            appointment: 'Hony Editor',
            contact: '9969205651',
            email: 'najjoseph@yahoo.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 5,
            rank: 'Brig',
            name: 'Suyash Sharma, VSM',
            appointment: 'Member',
            contact: '9654652898',
            email: 'suyash1967@yahoo.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 6,
            rank: 'Vice Adm',
            name: 'V Srinivas, AVSM, NM',
            appointment: 'Member',
            contact: '9491198803',
            email: 'srini18pra@yahoo.co.in',
            image: '/api/placeholder/80/80'
        },
        {
            id: 7,
            rank: 'Air Mshl',
            name: 'N Tiwari, VM',
            appointment: 'Member',
            contact: '9900169829',
            email: 'ntiwari.af@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 8,
            rank: 'Cmde',
            name: 'Raghunath Nair',
            appointment: 'Member',
            contact: '8985829534',
            email: 'preethyraghu@yahoo.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 9,
            rank: 'Cdr',
            name: 'Anil Jagtiani',
            appointment: 'Hony Treasurer',
            contact: '9650690100',
            email: 'rimcojags3@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 10,
            rank: 'Wg Cdr',
            name: 'Rajvir Yadav, VSM',
            appointment: 'Member',
            contact: '9899830967',
            email: 'rajvir.yadav1@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 11,
            rank: 'Maj',
            name: 'YS Meitei',
            appointment: 'Member',
            contact: '9871698917',
            email: 'yummymets@yahoo.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 12,
            rank: 'Col',
            name: 'Rahul Agrawal',
            appointment: 'Comdt, RIMC',
            contact: '',
            email: 'rimc-uk@nic.in',
            image: '/api/placeholder/80/80'
        },
        {
            id: 13,
            rank: 'Col',
            name: 'Vivek Sharma',
            appointment: 'Hony Secy',
            contact: '8459571893',
            email: 'vivekups9@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 14,
            rank: 'Col',
            name: 'Shailender Singh Arya',
            appointment: 'Member',
            contact: '9419984030',
            email: 'shailarya@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 15,
            rank: 'Capt (IN)',
            name: 'Manish Sain',
            appointment: 'Member',
            contact: '8527848279',
            email: 'manishsain123@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 16,
            rank: 'Mr',
            name: 'Saurabh Redhu',
            appointment: 'Member',
            contact: '9871250552',
            email: 'saurabh.redhu@gmail.com',
            image: '/api/placeholder/80/80'
        },
        {
            id: 17,
            rank: 'Mr',
            name: 'Abhishek Thapar',
            appointment: 'Member',
            contact: '9999100222',
            email: 'abhishekthapar@hotmail.com',
            image: '/api/placeholder/80/80'
        }
    ];

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedMembers = [...committeeMembers].sort((a, b) => {
        if (!sortField) return 0;

        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
        return sortDirection === 'asc' ?
            <span className="text-blue-500 ml-1">↑</span> :
            <span className="text-blue-500 ml-1">↓</span>;
    };

    return (
        <div className={`w-full ${isDark ? '' : 'bg-white'} max-w-6xl mx-auto p-4 font-serif`}>
            <div className="mb-8 text-center">
                <motion.h2
                    className="text-3xl font-bold inline-block relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    ROBA Working Committee Members
                    <div className="h-1 bg-[#C7A006] w-full absolute bottom-0"></div>
                </motion.h2>
                <motion.p
                    className="text-gray-600 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    As of March 13, 2025
                </motion.p>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-hidden shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-[#131E4C] text-white">
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                <button
                                    className="flex items-center focus:outline-none"
                                    onClick={() => handleSort('id')}
                                >
                                    S.No <SortIcon field="id" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                <button
                                    className="flex items-center focus:outline-none"
                                    onClick={() => handleSort('rank')}
                                >
                                    Rank <SortIcon field="rank" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                <button
                                    className="flex items-center focus:outline-none"
                                    onClick={() => handleSort('name')}
                                >
                                    Name <SortIcon field="name" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                <button
                                    className="flex items-center focus:outline-none"
                                    onClick={() => handleSort('appointment')}
                                >
                                    Appointment <SortIcon field="appointment" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-4 py-3 text-center text-sm font-medium">Photo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedMembers.map((member, index) => (
                            <motion.tr
                                key={member.id}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "#f8f4e3" }}
                            >
                                <td className="px-4 py-3 text-sm text-gray-900">{member.id}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.rank}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{member.appointment}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{member.contact}</td>
                                <td className="px-4 py-3 text-sm text-blue-600 hover:underline">
                                    <a href={`mailto:${member.email}`}>{member.email}</a>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-500 flex justify-center">
                                    <img
                                        // src={member.image}
                                        src={dummy}
                                        alt={`${member.rank} ${member.name}`}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-[#C7A006]"
                                    />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedMembers.map((member, index) => (
                    <motion.div
                        key={member.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <div className="p-4 flex items-center">
                            <img
                                src={member.image}
                                alt={`${member.rank} ${member.name}`}
                                className="w-16 h-16 rounded-full object-cover border-2 border-[#C7A006] mr-4"
                            />
                            <div>
                                <p className="text-xs font-medium text-[#C7A006]">#{member.id}</p>
                                <h3 className="font-bold text-gray-900">{member.rank} {member.name}</h3>
                                <p className="text-sm font-medium text-gray-700">{member.appointment}</p>
                            </div>
                        </div>
                        <div className="px-4 pb-4 pt-0">
                            <div className="grid grid-cols-1 gap-1">
                                <p className="text-sm">
                                    <span className="font-medium text-gray-500">Contact: </span>
                                    <span className="text-gray-900">{member.contact}</span>
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium text-gray-500">Email: </span>
                                    <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CommitteeMembersTable;