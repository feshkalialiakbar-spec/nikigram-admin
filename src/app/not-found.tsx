const NotFound = () => {
    return (
        <div style={{
            position: 'absolute'
            , top: 0
            , left: 0,
            width: '100%'
            , height: '100vh',
            display: 'flex',
            backgroundColor: '#f7ffff',
            backgroundClip: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'blue'
        }}>
            <div className="text-2xl font-bold">
                workeres are busy  ...
            </div>
        </div>
    )
}
export default NotFound