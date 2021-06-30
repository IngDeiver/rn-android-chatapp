import React, { useCallback, useMemo } from 'react'
import HomeTemplate from './home.template'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersThunk } from '../../redux/reducers/users.reducer'
import { createSelector } from '@reduxjs/toolkit';

const authSelecetor = () =>
  createSelector(
    state => state.auth,
    auth => auth,
  );

const HomeContainer = () => {
    const dispatch = useDispatch()
    const users = useSelector(state => state.users)
    const authSelectorMemorized = useMemo(authSelecetor, []);
    const auth = useSelector(authSelectorMemorized);

    const onRefresh = useCallback(() => {
        fetchUsers()
    })

    const fetchUsers = () => {
        dispatch(fetchUsersThunk(auth?._id))
    }

    React.useEffect(() => {
        fetchUsers()
    }, []);

    return <HomeTemplate users={users} onRefresh={onRefresh} />
}

export default HomeContainer