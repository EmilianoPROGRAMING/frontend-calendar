const { configureStore } = require("@reduxjs/toolkit");
const { renderHook, act } = require("@testing-library/react");
const { Provider } = require("react-redux");
const { useUiStore } = require("../../src/hooks/useUiStore");
const { uiSlice } = require("../../src/store");

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}

describe('probando el useUiStore', () => {

    test('debde e regresar los valores por defecto', () => {

        const mockStore = getMockStore({ isDateModalOpen: false });

        const {result} = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        });

        expect(result.current).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any(Function),
            openDateModal: expect.any(Function),
            togglesDateModal: expect.any(Function),
        });

    });

    test('openDateModal debe dar tru en el isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });

        const {result} = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        });

        const {openDateModal} = result.current;

        act( () => {
            openDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeTruthy();
    });

    test('closeDateModal debe de cerrar el isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });

        const {result} = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        });

        act( () => {
             result.current.closeDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeFalsy();
    });

    test('toggleDateModal debe de cambiar el estado respectivamente', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });

        const {result} = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        });


        act( () => {
             result.current.togglesDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeFalsy();

        act( () => {
            result.current.togglesDateModal();
       });

       expect( result.current.isDateModalOpen ).toBeTruthy();

    });


});