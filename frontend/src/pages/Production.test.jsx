import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockDispatch = vi.fn();
const mockUseSelector = vi.fn();
const mockFetchSuggestions = vi.fn(() => ({ type: 'production/fetchSuggestions' }));

vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockUseSelector(selector),
}));

vi.mock('../store/productionSlice', () => ({
    fetchSuggestions: () => mockFetchSuggestions(),
}));

import Production from './Production';

describe('Production page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar sugestões de produção quando houver dados', () => {
        const state = {
            production: {
                suggestions: {
                    suggestions: [
                        {
                            productName: 'garrafa',
                            quantity: 10,
                            subtotal: 300,
                        },
                    ],
                    totalPotentialValue: 300,
                },
                loading: false,
                error: null,
            },
        };

        mockUseSelector.mockImplementation((selector) => selector(state));

        render(<Production />);

        expect(screen.getByText('garrafa')).toBeTruthy();
        expect(screen.getByText('10')).toBeTruthy();
        expect(screen.getByText(/Valor Total/i)).toBeTruthy();
        expect(screen.getByText(/Subtotal: R\$ 300\.00/)).toBeTruthy();
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockFetchSuggestions).toHaveBeenCalled();
    });

    it('deve renderizar mensagem de lista vazia quando não houver sugestões', () => {
        const state = {
            production: {
                suggestions: {
                    suggestions: [],
                    totalPotentialValue: 0,
                },
                loading: false,
                error: null,
            },
        };

        mockUseSelector.mockImplementation((selector) => selector(state));

        render(<Production />);

        expect(screen.getByText(/Nenhuma sugestão disponível/i)).toBeTruthy();
    });

    it('deve renderizar alerta quando houver erro no carregamento', () => {
        const state = {
            production: {
                suggestions: {
                    suggestions: [],
                    totalPotentialValue: 0,
                },
                loading: false,
                error: 'Erro ao buscar sugestões',
            },
        };

        mockUseSelector.mockImplementation((selector) => selector(state));

        render(<Production />);

        expect(screen.getByText(/Falha ao buscar sugestões/i)).toBeTruthy();
        expect(screen.getByText(/Erro ao buscar sugestões/i)).toBeTruthy();
    });
});
