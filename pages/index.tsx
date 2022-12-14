import { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import Footer from '../components/footer'
import useTasks from '../hooks/useTasks'
import Task from '../components/Task'
import { useToast, Accordion, Button, Stack, ToastId } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'

 const Home: NextPage = () => {
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
        status: 'info',
        duration: null,
        isClosable: true,
        position: 'top-right'
      })
    } else {
      if (isError) {
        if (toastRefId.current) {
          toast.close(toastRefId.current)
        }

        toast({
          title: 'Error',
          description: error.response.data.errors[0].message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
      } else {
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
            disabled={ loading ? true : false }
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

export default Home
