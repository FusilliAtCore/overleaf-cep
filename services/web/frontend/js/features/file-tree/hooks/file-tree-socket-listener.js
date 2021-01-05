import { useCallback, useEffect } from 'react'

import { useFileTreeMutable } from '../contexts/file-tree-mutable'
import { useFileTreeSelectable } from '../contexts/file-tree-selectable'

export function useFileTreeSocketListener() {
  const {
    dispatchRename,
    dispatchDelete,
    dispatchMove,
    dispatchCreateFolder,
    dispatchCreateDoc,
    dispatchCreateFile
  } = useFileTreeMutable()
  const { select, unselect } = useFileTreeSelectable()
  const socket = window._ide && window._ide.socket

  const selectEntityIfCreatedByUser = useCallback(
    (entityId, userId) => {
      if (window.user && window.user.id && window.user.id === userId) {
        select(entityId)
      }
    },
    [select]
  )

  useEffect(() => {
    function handleDispatchRename(entityId, name) {
      dispatchRename(entityId, name)
    }
    if (socket) socket.on('reciveEntityRename', handleDispatchRename)
    return () => {
      if (socket)
        socket.removeListener('reciveEntityRename', handleDispatchRename)
    }
  }, [socket, dispatchRename])

  useEffect(() => {
    function handleDispatchDelete(entityId) {
      unselect(entityId)
      dispatchDelete(entityId)
    }
    if (socket) socket.on('removeEntity', handleDispatchDelete)
    return () => {
      if (socket) socket.removeListener('removeEntity', handleDispatchDelete)
    }
  }, [socket, unselect, dispatchDelete])

  useEffect(() => {
    function handleDispatchMove(entityId, toFolderId) {
      dispatchMove(entityId, toFolderId)
    }
    if (socket) socket.on('reciveEntityMove', handleDispatchMove)
    return () => {
      if (socket) socket.removeListener('reciveEntityMove', handleDispatchMove)
    }
  }, [socket, dispatchMove])

  useEffect(() => {
    function handleDispatchCreateFolder(parentFolderId, folder, userId) {
      dispatchCreateFolder(parentFolderId, folder)
      selectEntityIfCreatedByUser(folder._id, userId)
    }
    if (socket) socket.on('reciveNewFolder', handleDispatchCreateFolder)
    return () => {
      if (socket)
        socket.removeListener('reciveNewFolder', handleDispatchCreateFolder)
    }
  }, [socket, dispatchCreateFolder, selectEntityIfCreatedByUser])

  useEffect(() => {
    function handleDispatchCreateDoc(parentFolderId, doc, _source, userId) {
      dispatchCreateDoc(parentFolderId, doc)
      selectEntityIfCreatedByUser(doc._id, userId)
    }
    if (socket) socket.on('reciveNewDoc', handleDispatchCreateDoc)
    return () => {
      if (socket) socket.removeListener('reciveNewDoc', handleDispatchCreateDoc)
    }
  }, [socket, dispatchCreateDoc, selectEntityIfCreatedByUser])

  useEffect(() => {
    function handleDispatchCreateFile(
      parentFolderId,
      file,
      _source,
      _linkedFileData,
      userId
    ) {
      dispatchCreateFile(parentFolderId, file)
      selectEntityIfCreatedByUser(file._id, userId)
    }
    if (socket) socket.on('reciveNewFile', handleDispatchCreateFile)
    return () => {
      if (socket)
        socket.removeListener('reciveNewFile', handleDispatchCreateFile)
    }
  }, [socket, dispatchCreateFile, selectEntityIfCreatedByUser])
}
