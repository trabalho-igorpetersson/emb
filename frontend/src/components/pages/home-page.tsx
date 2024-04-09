'use client'

import { AppBar, Avatar, Box, Button, Card, CardContent, CardMedia, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { useProductStore } from '@/providers/products-store-provider'
import { IProduct } from '@/store/provider-store'
import Image from 'next/image'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useUserStore } from '@/providers/users-store-provider'

type ProductCart = IProduct & { quantity: number }

export default function HomePage() {

    const { products } = useProductStore((store) => store)
    const {user, setUser} = useUserStore((store) => store)

    const [cart, setCart] = useState<ProductCart[]>(
        products.map((product) => ({ ...product, quantity: 0 }))
    )

    const [toBuy, setToBuy] = useState<boolean>(false)

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    const addToCart = (product: IProduct) => {

        const productCart = cart.find((productCart) => productCart.id === product.id)

        if (productCart) {
            setCart(cart.map((productCart) => {
                if (productCart.id === product.id) {
                    return {
                        ...productCart,
                        quantity: productCart.quantity + 1
                    }
                }
                return productCart
            }))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const removeToCart = (product: IProduct) => {
        const productCart = cart.find((productCart) => productCart.id === product.id)

        if (productCart) {
            setCart(cart.map((productCart) => {
                if (productCart.id === product.id) {
                    return {
                        ...productCart,
                        quantity: productCart.quantity - 1
                    }
                }
                return productCart
            }))
        }

    }

    const buy = () => {
        if (cart.find((product) => product.quantity > 0)) {
            setToBuy(true);
            if (user) {
                setUser({ ...user, amount: user.amount - cart.reduce((acc, product) => acc + product.price * product.quantity, 0), name: user.name || '', email: user.email || '', password: user.password || '' });
            }
        }
    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        signOut();
        handleMenuClose();
    };

    const { data: session } = useSession()

    if (session) {

        return (
            <Box>

                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: '16px',
                        width: '100%',
                    }}>
                        <Box sx={{
                            margin: 0,
                            padding: 0,
                            width: '50%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Typography variant="body1" sx={{ marginRight: '10px' }}>
                                Crédito:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {formatPrice(user?.amount ?? 0)}
                            </Typography>
                            
                        </Box>
                        <Avatar sx={{ cursor: 'pointer' }} src="/broken-image.jpg" onClick={handleMenuOpen} />
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom', 
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top', 
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleLogout}>Sair</MenuItem>
                        </Menu>
                    </AppBar>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ padding: '20px', maxWidth: '1024px', width: '100%' }}>
                        {!toBuy ? (
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                                    <Box sx={{ width: '70%' }}>
                                        {products.map((product) => (
                                            <Card key={product.id} sx={{ display: 'flex', marginBottom: '20px' }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 100, objectFit: 'contain' }}
                                                    image={product.image}
                                                    alt="Product"
                                                />
                                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>


                                                    <CardContent>
                                                        <Typography variant="h5">{product.name}</Typography>
                                                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: '15px' }} >{formatPrice(product.price)}</Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            {product.available && cart.find(item => item.id === product.id) ? (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', padding: 0 }}>
                                                                    <IconButton
                                                                        disabled={cart.find(item => item.id === product.id)?.quantity === 0}
                                                                        onClick={() => removeToCart(product)} size="small">
                                                                        <RemoveIcon />
                                                                    </IconButton>
                                                                    <Typography variant="body1" sx={{ margin: '0px' }}>
                                                                        {cart.find(item => item.id === product.id)?.quantity}
                                                                    </Typography>
                                                                    <IconButton onClick={() => addToCart(product)} size="small">
                                                                        <AddIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            ) : (
                                                                <Button onClick={() => addToCart(product)} variant="contained" startIcon={<AddIcon />}>Adicionar</Button>
                                                            )}
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: '20px' }}>
                                                            {product.available ? (
                                                                <Typography variant="body2" color="success" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CheckCircleIcon sx={{ color: 'green' }} /> Disponível
                                                                </Typography>
                                                            ) : (
                                                                <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CancelIcon sx={{ marginRight: '5px' }} /> Indisponível
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </CardContent>

                                                </Box>
                                            </Card>
                                        ))}
                                    </Box>
                                    <Box sx={{ width: '30%', borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
                                        <Typography variant="h5">Ordem de compra</Typography>
                                        <Typography variant="h5">Total: {formatPrice(cart.reduce((acc, product) => acc + product.price * product.quantity, 0))}</Typography>
                                        <Button
                                            onClick={buy} variant="contained" color="primary">Comprar</Button>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                                <Typography variant="h5" sx={{ marginBottom: '20px' }}>Compra realizada com sucesso!</Typography>
                                <Typography variant="body1" sx={{ marginBottom: '20px' }}>Detalhes da compra:</Typography>
                                <List sx={{ width: '100%', maxWidth: 360, margin: '0 auto', marginBottom: '20px' }}>
                                    {products.map((product, index) => (
                                        (cart.find(item => item.id === product.id)?.quantity ?? 0) > 0 && (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={product.name}
                                                    secondary={`Quantidade: ${(cart.find(item => item.id === product.id)?.quantity ?? 0)}- Preço unitário: ${formatPrice(product.price)}`}
                                                />
                                            </ListItem>
                                        )
                                    ))}
                                </List>
                                <Typography variant="body1" sx={{ marginBottom: '20px' }}>Total gasto: {formatPrice(cart.reduce((acc, product) => acc + product.price * product.quantity, 0))}</Typography>
                                <Typography variant="body1" sx={{ marginBottom: '20px' }}>Agora você pode abrir a geladeira e desfrutar dos seus produtos.</Typography>
                                <Button onClick={() => {
                                    setToBuy(false)
                                    setCart(products.map((product) => ({ ...product, quantity: 0 })))
                                }} variant="contained" color="primary">Voltar</Button>
                            </Box>
                        )}
                    </Box>
                </Box>

            </Box>)

    }

    if (session === undefined) {
        return <Box></Box>
    }

    if (session === null) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Box
                    style={{
                        // centralizar verticalmente
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image src='/profile.jpeg' alt="Bem-vindo" width={450} height={250} />
                    <Typography variant="h4" gutterBottom>
                        Bem-vindo!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Você ainda não está logado. Por favor, faça login para acessar o conteúdo.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => signIn("keycloak")}>
                        Fazer Login
                    </Button>
                </Box>

            </Box>
        )
    }

}