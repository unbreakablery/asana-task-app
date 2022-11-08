import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import parse from "html-react-parser"
import axios from "axios"
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
  HStack,
  StackDivider,
  Text,
  Textarea,
  Box, 
  Button, 
  ToastId, 
  useToast 
} from '@chakra-ui/react'
import { CheckCircleIcon, SmallCloseIcon, InfoOutlineIcon } from '@chakra-ui/icons'

const Task = ({ task }: { task: any }) => {
  const baseURL = process.env.NEXT_PUBLIC_ASANA_API_BASE_URL
  const cfDesignId = process.env.NEXT_PUBLIC_ASANA_CF_DESIGN_ID ? process.env.NEXT_PUBLIC_ASANA_CF_DESIGN_ID : ''
  const cfApproveId = process.env.NEXT_PUBLIC_ASANA_CF_APPROVE_ID ? process.env.NEXT_PUBLIC_ASANA_CF_APPROVE_ID : ''
  const cfRejectId = process.env.NEXT_PUBLIC_ASANA_CF_REJECT_ID ? process.env.NEXT_PUBLIC_ASANA_CF_REJECT_ID : ''

  const toast = useToast()
  const toastRefId = useRef<ToastId>()

  const [designStatus, setDesignStatus] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }

  const handleDesignApproval = async (cf: string) => {
    if (saving) return
    if (!task || !task.gid) return

    const m1 = cf === 'approve' ? 'Approving' : (cf === 'reject' ? 'Rejecting' : '')
    const m2 = cf === 'approve' ? 'Approved' : (cf === 'reject' ? 'Rejected' : '')

    setSaving(true)
    toastRefId.current = toast({
      title: `${m1}...`,
      // description: '',
      status: 'info',
      // duration: 5000,
      isClosable: true,
      position: 'top-right'
    })
    try {
      const custom_fields: any = {}
      custom_fields[`${cfDesignId}`] = cf === 'approve' ? cfApproveId : (cf === 'reject' ? cfRejectId : '')

      await axios.put(`${baseURL}/tasks/${task.gid}`, {
        data: {
          "custom_fields": custom_fields
        }
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ASANA_SECRET}`
        }
      }).then((result) => {
        if (toastRefId.current) {
          toast.close(toastRefId.current)
        }

        toast({
          title: m2,
          // description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
        setDesignStatus(m2)
      }).catch((err) => {
        if (toastRefId.current) {
          toast.close(toastRefId.current)
        }

        toast({
          title: `Error While ${m1}...`,
          description: err.errors[0].message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
      })
    } catch (err) {
      if (toastRefId.current) {
        toast.close(toastRefId.current)
      }

      toast({
        title: 'HANDLE_UPDATE_ERROR',
        //description: '',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleApproveWithComment = async () => {
    if (saving) return
    if (!task || !task.gid) return
    
    setSaving(true)
    toastRefId.current = toast({
      title: 'Approving with comment...',
      // description: '',
      status: 'info',
      // duration: 5000,
      isClosable: true,
      position: 'top-right'
    })
    try {
      const custom_fields: any = {}
      custom_fields[`${cfDesignId}`] = cfApproveId

      const cfResult = await axios.put(`${baseURL}/tasks/${task.gid}`, {
        data: {
          "custom_fields": custom_fields
        }
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ASANA_SECRET}`
        }
      })

      if (comment) {
        const stResult = await axios.post(`${baseURL}/tasks/${task.gid}/stories`, {
          data: {
            "is_pinned": false,
            "text": comment
          }
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ASANA_SECRET}`
          }
        })
      }

      if (toastRefId.current) {
        toast.close(toastRefId.current)
      }

      toast({
        title: 'Approved with comment',
        // description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
      setDesignStatus('Approved')
    } catch (err: any) {
      if (toastRefId.current) {
        toast.close(toastRefId.current)
      }
            
      toast({
        title: 'HANDLE_UPDATE_ERROR',
        description: err.response.data.errors[0].message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    } finally {
      setSaving(false)
      setComment('')
    }
  }

  useEffect(() => {
    if (task) {
      const cfds = task.custom_fields.filter((cf: any) => cf.gid === process.env.NEXT_PUBLIC_ASANA_CF_DESIGN_ID)
      setDesignStatus(cfds.length > 0 ? cfds[0].display_value : '')
    }
  }, [task])

  return (
    <AccordionItem>
      <h2>
        <AccordionButton _expanded={{ bg: 'tomato', color: 'white' }}>
          <Box flex='1' textAlign='left'>
            { task?.name } - { task?.memberships[0].section.name }
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <HStack
          divider={<StackDivider borderColor='gray.200' />}
          spacing={4}
          align='stretch'
          bg='gray.900'
          color='white'
        >
          <Stack direction='column' spacing={4} w='300px' p='4'>
            <Text fontSize='20'>Status: {designStatus}</Text>
            <Button 
              colorScheme='green' 
              leftIcon={<CheckCircleIcon />}
              onClick={() => handleDesignApproval('approve')}
              disabled={saving ? true : false}
            >
              Approve
            </Button>
            <Button 
              colorScheme='red' 
              leftIcon={<SmallCloseIcon />}
              onClick={() => handleDesignApproval('reject')}
              disabled={saving ? true : false}
            >
              Reject
            </Button>
            <Button 
              colorScheme='yellow' 
              leftIcon={<InfoOutlineIcon />}
              onClick={handleApproveWithComment}
              disabled={saving ? true : false}
            >
              Approve + Comment
            </Button>
            <Textarea
              value={comment}
              onChange={(e) => handleCommentChange(e)}
              placeholder='Please enter your comment'
              size='sm'
            />
          </Stack>
          <Stack direction='column' spacing={4} p='4'>
            <Text fontSize='20' fontWeight='bold'>{task?.name}</Text>
            <div color="white">
              { parse(task?.html_notes.replace("<body>", "").replace("</body>", "")) }
            </div>
          </Stack>
        </HStack>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default Task
