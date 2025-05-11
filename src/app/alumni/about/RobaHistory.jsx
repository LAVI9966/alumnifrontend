import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
const RobaHistory = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div id='history'>
            <div className="flex items-center gap-4 w-full my-6">
                <hr className="flex-grow border-t border-2 border-[#C7A006]" />
                <span className={`${isDark ? '' : 'bg-cyan-400'}  font-bold text-5xl whitespace-nowrap text-center text-[2rem] sm:text-5xl`}>
                    ROBA HISTORY
                </span>
                <hr className="flex-grow border-t border-2 border-[#C7A006]" />
            </div>
            <div className="flex flex-col md:flex-row gap-6 p-2 sm:p-6 max-w-5xl mx-auto">
                <div className="flex-1 space-y-6 text-justify text-[15px] sm:text-[17px] leading-7   font-serif  p-4">
                    <div className="flex flex-col font-serif md:flex-row gap-4 md:gap-6">
                        <p className="order-2 md:order-1">
                            The Rimcollian Old Boys Association acronym as ROBA was formed in
                            August 1949. Maj Gen Hira Lal Atal, the then Adjutant General, was
                            the founder President and Gen (then Col) GG Bewoor (Kitcheners
                            1928-34), the First Secretary. The Old Boys Reunion started in 1952
                            and were held in Dehradun coinciding with Founder's Day. Till 1958,
                            the reunions were alternated between Delhi and Dehradun.
                        </p>
                        <div className="md:w-[160px] md:min-w-[160px] w-full max-w-xs mx-auto order-1 md:order-2">
                            <img
                                src="/History_image.avif"
                                alt="Rimcollian Crest"
                                className="object-contain w-full h-auto rounded"
                            />
                        </div>
                    </div>
                    <p>
                        The First Newsletter, The Rimcollian was published in March 1953 with
                        Lt Col Jasbir Singh Khurana being the first Editor. At the 1956
                        Annual Reunion at Delhi, Vice President of India, Dr S Radhkrishnan
                        was the Chief Guest being the First non-Rimcollian Chief Guest. In
                        the reunion of 1958 at Delhi, it was decided to hold Annual Reunions
                        only at Dehradun from 12-14 March each year. On 01 December 1955, the
                        Government announced in the parliament, renaming college to Sainik
                        School, however, with the perseverance of the efforts of the then
                        Chief of the Army Staff, Gen KS Thimayya, DSO, the first Rimcollian
                        COAS, the school was renamed as Rashtriya Indian Military College. In
                        1964, the old crest with the Ostrich plumes and the British Crown was
                        replaced with the Peacock Feathers with Ashoka Chakra having the Bull
                        & the Horse on either side. The old Crest since then became the crest
                        of the Rimcollians and the new one being of the school.
                    </p>
                    <p>
                        At the Golden Jubilee celebrations from 11 -14 March 1972, the President of India, Dr VV Giri was the Chief Guest with the three Rimcollian Army Commanders, Lt Gen GG Bewoor (Kitchener 1928-34), Lt Gen KP Candeth (Rawlinson 1928-34) and Lt Gen Preminder Singh Bhagat (Rawlinson 1930-36) in attendance. Maj Gen Virendera Singh (Kitchener 1929-35) was the President ROBA and Brig (then Lt Col) Narjit Singh (Roberts 1941-1948) the Secretary of the Association. During this momentous occasion, the Old Boys Association presented to the RIMC a War Memorial. The design of this memorial resembles the John Kennedy Memorial in Washington, USA. This memorial is located in the centre of the lawn opposite the school  Flag Mast. The First wreathe was laid by the First Cadet of the School, Maj Gen Hira Lal Atal. On 01 Jan 1973, the second Rimcollian to become the COAS was Gen GG Bewoor.
                    </p>
                    <p>At the reunion of 1980, the Old Boys Association presented two bronze busts to the college, in memory of Lt Gen Preminder Singh Bhagat, Victoria Cross and Maj Somnath Sharma, Param Vir Chakra. They stand installed at the Convocation Hall and the Library which were rechristened as Bhagat Hall and Somnath Library respectively. The Diamond Jubilee celebrations were held from 11-14 March 1982. The association was headed by Lt Gen K Surendra Singh (Roberts 1939-42) and Brig (then Lt Col) AN Luthra (Shivaji 1951-55) as the Secretary. The ROBA gifted the cadets with a Silver trophy bearing the new college crest of three peacock feathers. Gen VN Sharma took over as the 15th COAS on 01 May 1988 and the Third Rimcollian Chief. He was later the ROBA President from 1993-97 and has been the Chairman of the ROBA Trust since its formation in March 1995 till date.</p>
                    <p>
                        With the efforts of Gen VN Sharma, RIMC got its first Rimcollian Commandant, Col (later Maj Gen) SD Mohanti. On 31 Jul 1991, Air Chief Marshal NC Suri took over as the 15th Chief of Air Staff and the First Rimcollian CAS. He was the President ROBA from 1989 to 1993. In the reunion of 1990, it was for the first time that Rimcollians from Pakistan & Bangladesh attended the function. This opened the old windows of camaraderie. In Mar 1996, 20 old boys along with their spouses led by Maj Gen Virendra Singh  visited Pakistan at the invitation of Pakistani Old Boys. In reciprocation, 16 Old Boys from Pakistan attended the Platinum Jubilee Celebrations at the College in March 1997.
                    </p>
                    <p>
                        The Platinum Jubilee was celebrated from 11-14 March 1997. The President of India, Dr Shankar Dayal Sharma was the Chief Guest. The President of the ROBA was Gen VN Sharma, former COAS (Rawlinson 1941-445) and the Secretary was Col (later Maj Gen) SVP Singh (Shivaji 1961-66).In presence were four serving Cs-in-C, Lt Gen (later Gen) S ‘Paddy’ Padmanabhan (Shivaji 1952-55), Lt Gen HM Khanna (Ranjit 1952-56), V Adm AR Tandon (Ranjit 1951-55) and Air Mshl Vinod Patney (Pratap 1953-56). In addition present was Lt Gen SS Grewal, the Adjutant General (Shivaji 1953-57). A total of 1200 Rimcollians including from abroad accompanied by their ladies and guests graced this event. The occasion saw the presence of a large contingent of Pakistani Old Boys, from Britain and a few more overseas countries. The senior most Pakistani Old Boy was Capt Taj Mohd Khanzada (Rawlinson 1926-33), and included their former Foreign Minister Lt Gen Sahibzada Yakub Khan (Kitchener 1932-36), former service chiefs Air Marshal M Asghar Khan (Rawlinson 1933-37) and Lt Gen Gul Hassan Khan (Roberts 1933-40). From Britain was The Viscount Col John Slim (Wavell 1942-44). The ROBA presented the ‘Platinum Jubilee Gate’ on this     occasion which opened on the Garhi canal side. During this occasion ‘Catchpole Guest House’, built from the money donated by former Principal Mr Hugh Catchpole was also inaugurated. On the occasion, 34 Old Boys of Wavell Section led by The Viscount Slim plus former Section Master Mr FC Harris and Principal Mr EJ Watson from the UK, presented a sword made by the famous Wilkinson Sword. A mini replica of the sword is presented to the passing out Cadet adjudged to possess the highest character and integrity.


                    </p>
                    <p>
                        Registration of ROBA. ROBA was officially registered with the Registrar of Societies under the Societies Registration Act XXI of 1860 on 24 April 2000 and under Income Tax Act 1961 on 16 March 2001. It is exempted from income tax under Section 80G of the IT Act. There were 1103 members when the association was registered as a Society. Today this membership stands at 2808. The Rimcollian Journal, the Website, The Rimcollian E-Group and the Centennial Series Calendars are the vital branches of the ROBA.
                    </p>
                    <p>
                        30 September 1999, another school boy rose to be the 20th Indian Army Chief, Gen S ‘Paddy’ Padmanabhan (Shivaji 1952-56).


                    </p>
                    <p>
                        The 2000 Millennium Reunion was attended by 140 Rimcollians.  At the General Body meeting, the millennium volume Coffee Table Book, ‘Cradle of Bravery’ was released by Dr NM ‘Appa’ Ghatate. Edited and conceived by Sid Mishra
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RobaHistory