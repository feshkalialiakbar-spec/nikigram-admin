import WithNavbarLayout from "@/components/layouts/withNavbarLayout/WithNavbarLayout";

const NotFound = () => {
    return (
        <WithNavbarLayout>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                display: 'flex',

                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f7ffff',
                color: '#1e3a8a',
                fontFamily: 'sans-serif',
                textAlign: 'center',
                padding: '20px'
            }}>
                <h1 style={{
                    fontSize: '6rem',
                    fontWeight: 'bold',
                    margin: 0,
                    animation: 'blink 1.2s infinite'
                }}>
                    404
                </h1>
                <div style={{
                    fontSize: '1.5rem',
                    marginTop: '12rem'
                }}>
                    صفحۀ مورد نظر پیدا نشد! <br />
                    <p style={{ marginTop: '2rem', color: '#2563eb', fontWeight: 'bold' }}>کاربران مشغول هستند ...</p>
                </div>

                <style>
                    {`
            @keyframes blink {
              0%, 50%, 100% { opacity: 1; }
              25%, 75% { opacity: 0.3; }
            }
            `}
                </style>
            </div>
        </WithNavbarLayout>
    )
}

export default NotFound;
