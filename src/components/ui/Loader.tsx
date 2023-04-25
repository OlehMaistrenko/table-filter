function Loader() {
  return (
    <div className='loader'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100px'
        height='100px'
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid'
      >
        <path
          d='M4 50A46 46 0 0 0 96 50A46 48.8 0 0 1 4 50'
          fill='#d93631'
          stroke='none'
        >
          <animateTransform
            attributeName='transform'
            type='rotate'
            dur='1s'
            repeatCount='indefinite'
            keyTimes='0;1'
            values='0 50 51.4;360 50 51.4'
          ></animateTransform>
        </path>
      </svg>
    </div>
  );
}
export default Loader;
