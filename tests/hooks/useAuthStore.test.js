import { configureStore } from "@reduxjs/toolkit"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice, store } from "../../src/store"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { testUserCredentials } from "../fixtures/testUser"
import { calendarApi } from "../../src/api"

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}



describe('probando el useAuthStore', () => {

    beforeEach(() => localStorage.clear() );

    test('debe de retornar los valores por defecto', () => {

        const mockStore = getMockStore({ ...initialState });

        const {result} = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        });

        expect(result.current).toEqual({
            status: 'checking',
            errorMessage: undefined,
            user: {},

            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),

        });

    }); 

    test('startLogin debe de realizar el login correctamente', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const {result} = renderHook( () => useAuthStore(),{
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin( testUserCredentials );
        });

        const {errorMessage, status, user} = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'test-user' , uid: '6621f169030909a56f33d15d' }
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
    });

    test('startLogin debe de fallar la authentication', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const {result} = renderHook( () => useAuthStore(),{
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin({ email: 'test@example.com', password: 123456789 });
        });

        const {errorMessage, status, user} = result.current;
        expect( localStorage.getItem('token')).toBe(null);
        expect({errorMessage, status, user}).toEqual({
            errorMessage: 'credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        );

    });

    test('startRegister debe de crear un usuario', async() => {

        const newUser = {email: 'test@example.com', password: 123456789 , name: 'toble user'}

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const {result} = renderHook( () => useAuthStore(),{
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: '123456789',
                name: 'tester user',
                token: 'ALGUN TOKEN'
            }
        });

        await act(async () => {
            await result.current.startRegister({ newUser });
        });

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'tester user', uid: '123456789' }
        });

        spy.mockRestore();

    });

    test('startRegister debe de fallar la creacion', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const {result} = renderHook( () => useAuthStore(),{
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });

        await act(async () => {
            await result.current.startRegister(testUserCredentials);
        });

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual({
            errorMessage: 'un usuario existe con ese correo',
            status: 'not-authenticated',
            user: {}
        });        
    });

    test('checkAuthToken debe de fallar si no hay un token', async() => {

        const mockStore = getMockStore({ initialState });
        const {result} = renderHook( () => useAuthStore(),{
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const {errorMessage, status, user} = result.current;

        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });

    });

    test('checkAuthToken debe de autenticar el usaurio si hay token', async() => {

        const { data } = await calendarApi.post('/auth', testUserCredentials );
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const {result} = renderHook( () => useAuthStore(),{
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const {errorMessage, status, user} = result.current;
        
        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'test-user', uid: '6621f169030909a56f33d15d'}
        });
        // console.log(result.current);


        
    })
});