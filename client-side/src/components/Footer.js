import React from 'react'
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDiscord } from 'react-icons/bs'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'

const FooterCom = () => {
    return (
        <Footer container className='border-t-8 border-blue-400 bg-gray-100'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                    <div>
                        <Link to={'/'} className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            <span className='px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg'>
                                Mohan's
                            </span>
                            Blog
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 mt-5 sm:grid-cols-3 sm:gap-6'>
                        <div>
                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#' text='_blank' rel='noopener noreferrer'>
                                    100 Js Project
                                </Footer.Link>
                                <Footer.Link href='/about' text='_blank' rel='noopener noreferrer'>
                                    Mohan's Blog
                                </Footer.Link>
                                {/* <Footer.Link href='#' text='_blank' rel='noopener noreferrer'>
                                    100 Js Project
                                </Footer.Link> */}
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title='Follow us' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#' text='_blank' rel='noopener noreferrer'>
                                    Github
                                </Footer.Link>
                                <Footer.Link href='/about' text='_blank' rel='noopener noreferrer'>
                                    Discord
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title='Legal' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#'>
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href='#'>
                                    Term &amp; Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex sm:items-center sm:justify-between'>
                    <Footer.Copyright href='#' by="Mohan's blog" year={new Date().getFullYear()}
                    />
                    <div className='flex gap-6 sm:mt-2 mt-4 sm:justify-center'>
                        <Footer.Icon href='#' icon={BsFacebook} />
                        <Footer.Icon href='#' icon={BsInstagram} />
                        <Footer.Icon href='#' icon={BsGithub} />
                        <Footer.Icon href='#' icon={BsTwitter} />
                        <Footer.Icon href='#' icon={BsDiscord} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterCom