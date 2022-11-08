import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/header'
import Footer from './components/footer'
import Task from './components/Task'
import { useState, useEffect, useRef } from 'react';
import { Flex, useToast, Accordion, Button, Stack, ToastId } from '@chakra-ui/react'
import useTasks from './hooks/useTasks'
import { RepeatIcon } from '@chakra-ui/icons'
import { Http2ServerRequest } from 'http2'

interface ITask {
  id: number
  name: string
}

export default function Home() {
  const projectId = process.env.NEXT_PUBLIC_ASANA_PROJECT_ID

  const toast = useToast()
  const toastRefId = useRef<ToastId>()
  
  const { data: tasks, isError, error, loading, getTasks } = useTasks(projectId)

  const handleRefresh = () => {
    getTasks()
  }

  useEffect(() => {
    if (loading) {
      toastRefId.current = toast({
        title: 'Loading...',
        // description: '',
        status: 'info',
        // duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    } else {
      if (isError) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
      } else {
        if (toastRefId.current) {
          toast.close(toastRefId.current)
        }
        
        toast({
          title: 'Fetched tasks successfully!',
          // description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
      }
    }
  }, [loading])


  return (
    <div className={styles.container}>
      <Header title="Asana Task App" description="Asana Task App" />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Design Approval For Mattered
        </h1>
        <Stack direction='row' spacing={4} p='4' w='full' justifyContent='flex-end'>
          <Button 
            colorScheme='blue'
            leftIcon={<RepeatIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Stack>
        <Accordion defaultIndex={[0]} allowToggle w='full'>
          {tasks && tasks.map((task: any, index: number) => (
            <Task key={index} task={task} />
          ))}
        </Accordion>
      </main>

      <Footer />
    </div>
  )
}
