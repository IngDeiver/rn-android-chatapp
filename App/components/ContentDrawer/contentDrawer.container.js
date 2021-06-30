import React from 'react'
import { useDispatch } from 'react-redux'
import ContentDrawerTemplate from './contentDrawer.template'
import { logoutThunk } from '../../redux/reducers/auth.reducer'


const ContentDrawerContainer = (props) => {

    const dispatch = useDispatch()

    const exit = (method) => {
        props.navigation.closeDrawer()
        dispatch(logoutThunk({ method }))

    }

    return <ContentDrawerTemplate {...props} logout={exit} />
}

export default ContentDrawerContainer