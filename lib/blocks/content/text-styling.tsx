import React, { useEffect, useState } from 'react'
import { Slider } from '@/app/components/ui/slider'
import { SketchPicker } from 'react-color'
import { textStyling, TextStyles, FontColorType, fontSizes, allFonts, loadFont } from './config'
import { useEditModeContext } from '@/app/contexts/Edit'
import { useGoogleFontsContext } from '@/app/contexts/GoogleFonts/indes'


type Prop = {
  name: string
  blockId: string
}

export const TextStyling = ({ name, blockId }: Prop) => {
  const { contentStyles, setContentStyles } = useEditModeContext();
  console.log('blockId ======  ', blockId);
  // destructuring rgba from state
  const selectedElement = name === 'title' ? contentStyles?.title : contentStyles?.content

  const { googleFonts } = useGoogleFontsContext()
  
  const [isOpenColorPicker, setIsOpenColorPicker] = useState(false);

  const handleColorPicker = () => {
    setIsOpenColorPicker(prev => !prev)
  }

  const handleFontFamilyChange = (e: any) => {
    const fontFamily = e.target.value
    name === 'title' ?
    setContentStyles((prev: any) => ({...prev, title: {...prev.title, fontFamily}})) :
    setContentStyles((prev: any) => ({...prev, content: {...prev.content, fontFamily}}))

    loadFont(fontFamily)
    
  }

  const handleFontSizeChange = (e: any) => {
    const value = e.target.value
    name === 'title' ?
    setContentStyles((prev: any) => ({...prev,  title: {...prev.title, fontSize: `${value}px`}})) :
    setContentStyles((prev: any) => ({...prev,  content: {...prev.content, fontSize: `${value}px`}}))
  }

  const handleFontColorChange = (value: any) => {
    // console.log('handleChange => ', e.rgb);
    const {r, g, b, a} = value.rgb
    name === 'title' ?
    setContentStyles((prev: any) => ({...prev,  title: {...prev.title, color: `rgba(${r}, ${g}, ${b}, ${a})`}})) :
    setContentStyles((prev: any) => ({...prev,  content: {...prev.content, color: `rgba(${r}, ${g}, ${b}, ${a})`}}))
    
  }

  const handleFontWeightChange = (e: any) => {
    // console.log('handleChange => ', e.target.value);
    
    const value = e.target.value
    console.log('value =>>> ', value);
    
    name === 'title' ?
    setContentStyles((prev: any) => ({...prev,  title: {...prev.title, fontWeight: Number(value)}})) :
    setContentStyles((prev: any) => ({...prev,  content: {...prev.content, fontWeight: Number(value)}}))
    
  }

  const handleLetterSpacingChange = (e: any) => {
    // console.log('handleChange => ', e.target.value);
    
    const value = e.target.value
    name === 'title' ?
    setContentStyles((prev: any) => ({...prev,  title: {...prev.title, letterSpacing: `${value}px`}})) :
    setContentStyles((prev: any) => ({...prev,  content: {...prev.content, letterSpacing: `${value}px`}}))
    
  }
  
  const handleLineSpacingChange = (e: any) => {
    // console.log('handleChange => ', e.target.value);
    const value = e.target.value
    name === 'title' ?
    setContentStyles((prev: any) => ({...prev,  title: {...prev.title, lineHeight: `${value}px`}})) :
    setContentStyles((prev: any) => ({...prev,  content: {...prev.content, lineHeight: `${value}px`}}))
    
  }

   // Function to dynamically load Google Fonts
  //  const loadFont = (fontFamily: any) => {
  //   const link = document.createElement('link');
  //   link.href = `https://fonts.googleapis.com/css2?family=${fontFamily?.replace(/ /g, '+')}&display=swap`;
  //   link.rel = 'stylesheet';
  //   document.head.appendChild(link);
  // };
  

  return (
    <div className='bg-gray-100 rounded-md py-3 px-2'>
      {/* <h1 className='text-lg font-medium mt-3'>{name}</h1> */}
      <div className='grid grid-cols-6 gap-3'>
        
        <select className='rounded-md col-span-6 border border-gray-200 focus:border-black shadow-none focus:outline-none focus:ring-0' value={selectedElement?.fontFamily} onChange={handleFontFamilyChange}>
          {googleFonts?.map((val: any) => (
            <option key={val.family} value={val.family}>{val.family}</option>
          ))}
        </select>
        {/* Font Size */}
        <select className='rounded-md col-span-5 border border-gray-200 focus:border-black shadow-none focus:outline-none focus:ring-0' value={selectedElement?.fontSize?.replace("px", "")} onChange={handleFontSizeChange}>
          {fontSizes?.map((val: number) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
        {/* Font Color */}
        <div className='relative col-span-1 flex justify-center items-center'>
          <div
          style={{
            backgroundColor: selectedElement?.color,
            width: 25,
            height: 25,
            borderRadius: '5px',
            boxShadow: '0 0 0 3px white, 0 0 0 4px black',
          }}  
          onClick={handleColorPicker}
        >
          </div>
          {isOpenColorPicker && <SketchPicker
            onChange={handleFontColorChange}
            color={selectedElement?.color}
            className='absolute top-full right-0 z-50 tranform translate-y-2'
          />}

        </div>
        {/* Font Weight */}
        <div className='col-span-6'>
          <p className='mb-2'>Font Weight</p>
          <Slider defaultValue={[selectedElement?.fontWeight || 0]} max={800} min={100} step={100} onChange={handleFontWeightChange} />
        </div>
        {/* Letter Spacing */}
        <div className='col-span-6'>
          <p className='mb-2'>Letter Spacing</p>
          <Slider defaultValue={[selectedElement?.letterSpacing?.replace("px", "") || 0]} max={50} step={1} onChange={handleLetterSpacingChange} />
        </div>
        {/* Line Spacing */}
        <div className='col-span-6'>
          <p className='mb-2'>Line Spacing</p>
          <Slider defaultValue={[selectedElement?.lineHeight?.replace("px", "") || 0]} max={150} step={1} onChange={handleLineSpacingChange} />
        </div>
      </div>
    </div>
  
  )
}