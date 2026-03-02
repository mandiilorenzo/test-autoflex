import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                bgcolor: 'background.default',
            }}
        >
            <Paper elevation={3} sx={{ p: { xs: 4, md: 6 }, maxWidth: 680, width: '100%', textAlign: 'center' }}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Bem-vindo ao Autoflex
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Sistema para gerenciamento de matérias-primas, produtos e sugestão de produção.
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                    Ambiente de teste técnico sem autenticação.
                </Typography>
                <Button size="large" variant="contained" onClick={() => navigate('/products')}>
                    Acessar Produtos
                </Button>
            </Paper>
        </Box>
    );
};

export default Home;
