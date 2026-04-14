'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, setDoc, getDoc
} from 'firebase/firestore'
import { db } from './firebase'

// Generic hook for any collection with real-time updates
export function useCollection<T extends { id: string }>(collectionName: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, collectionName))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map(d => ({ ...d.data(), id: d.id } as T)))
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err)
        setError(err.message)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [collectionName])

  const add = useCallback(async (item: Omit<T, 'id'> & { id?: string }) => {
    try {
      if (item.id) {
        await setDoc(doc(db, collectionName, item.id as string), item)
        return item.id as string
      } else {
        const ref = await addDoc(collection(db, collectionName), item)
        return ref.id
      }
    } catch (e: any) {
      setError(e.message)
      throw e
    }
  }, [collectionName])

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    try {
      await updateDoc(doc(db, collectionName, id), updates as any)
    } catch (e: any) {
      setError(e.message)
      throw e
    }
  }, [collectionName])

  const remove = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id))
    } catch (e: any) {
      setError(e.message)
      throw e
    }
  }, [collectionName])

  return { data, loading, error, add, update, remove }
}

// Chart config hook (stored as a single doc)
export function useChartConfig() {
  const [charts, setCharts] = useState<{ revenueChart: any[]; otifChart: any[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'charts'), (snap) => {
      if (snap.exists()) {
        setCharts(snap.data() as any)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return { charts, loading }
}
