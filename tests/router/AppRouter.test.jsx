import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/router/AppRouter";
import { CalendarPage } from "../../src/calendar";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../src/hooks/useAuthStore");

jest.mock('../../src/calendar', () => ({
    CalendarPage: () => 
    <h1>CalendarPage</h1>
}))



describe('probando el AppRouter', () => {

    const mockCheckAuthToken = jest.fn();

    beforeEach(() => jest.clearAllMocks() );


    test('debe de mostrar la pantalla de carga y llamar el checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });

        render( <AppRouter /> );

        expect(screen.getByText('Cargando...') ).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    });

    test('debe de mostrar el login en caso de no estar authenticado', () => {
        
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        const {container} = render( 
            <MemoryRouter initialEntries={['/auth2/algo/otracosa']}>
                <AppRouter /> 
            </MemoryRouter>
        );

        expect(screen.getByText('Ingreso') ).toBeTruthy();
        expect(container).toMatchSnapshot();
    });

    test('debe de mostrar el calendario si esta authenticado', () => {

        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );

        screen.debug();
        // expect( screen.getByText('CalendarPage') ).toBeTruthy();


    });
})