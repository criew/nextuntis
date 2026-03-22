import httpClient from './httpClient'
import type { components } from '../types/generated/api'

type StudentResponse = components['schemas']['StudentResponse']
type StudentRequest = components['schemas']['StudentRequest']

export const getStudents = (): Promise<StudentResponse[]> =>
  httpClient.get<StudentResponse[]>('/api/students').then((res) => res.data)

export const getStudent = (id: number): Promise<StudentResponse> =>
  httpClient.get<StudentResponse>(`/api/students/${id}`).then((res) => res.data)

export const createStudent = (data: StudentRequest): Promise<StudentResponse> =>
  httpClient.post<StudentResponse>('/api/students', data).then((res) => res.data)

export const updateStudent = (id: number, data: StudentRequest): Promise<StudentResponse> =>
  httpClient.put<StudentResponse>(`/api/students/${id}`, data).then((res) => res.data)

export const deleteStudent = (id: number): Promise<void> =>
  httpClient.delete(`/api/students/${id}`).then(() => undefined)
