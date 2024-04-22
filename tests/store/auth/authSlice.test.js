import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState } from "../../fixtures/authStates"
import { testUserCredentials } from "../../fixtures/testUser";

describe('probando el authSlice', () => {

    test('debe de retornar el estado inicial', () => {

        expect( authSlice.getInitialState() ).toEqual( initialState );

    });

    test('debe de hacer el login', () => {

        const state  = authSlice.reducer( initialState, onLogin(testUserCredentials) );
        expect( state ).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })
    });

    test('debe de realizar el logout', () => {
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        })

    });

    test('debe de realizar el logout con el payload', () => {
        const errorMessage = 'credenciales erroneas pelotudo'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage
        })
    });

    test('debe de limpiar el errorMessage', () => {
        const errorMessage = 'credenciales erroneas pelotudo'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );
        const newState = authSlice.reducer( state, clearErrorMessage() )

        expect(newState.errorMessage).toBe(undefined);

    });

    test('debe de llamar el checking', () => {
        const state = authSlice.reducer( authenticatedState, onChecking() );
        expect(state).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined
        })

    });
})