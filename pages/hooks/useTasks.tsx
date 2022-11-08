import axios from "axios"
import { useEffect, useState } from "react"

const useTasks = (projectId: any) => {
  const baseURL = process.env.NEXT_PUBLIC_ASANA_API_BASE_URL
  
  const [data, setData] = useState<any>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getTasks = async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${baseURL}/projects/${projectId}/tasks`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ASANA_SECRET}`
        },
        params: {
          opt_fields: 'gid,name,notes,html_notes,assignee_status,custom_fields,dependencies,dependents,assignee,completed,start_on,tags,memberships.section.name'
        }
      })
      setData(result.data.data)
      setIsError(false)
      setError({})
    } catch (err) {
      setData(null)
      setIsError(true)
      setError(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (projectId) getTasks()
  }, [projectId]);

  return {
    data,
    isError,
    error,
    loading,
    getTasks
  }
}

export default useTasks