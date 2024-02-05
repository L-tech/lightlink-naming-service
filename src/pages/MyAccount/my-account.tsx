import React, { useContext, useEffect, useState } from 'react'
import { ReactComponent as GlobeLogo } from '../../assets/icons/globe-icon.svg'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import { copyToClipboard } from '../../lib/utils'
import { getExpiry, getOwnerNames, getUserLevel, getUserXp } from '../../services/lightlink-lns'
import { toast } from '../../hooks/useToast'
import { Web3Context } from '../../context/web3-context'
import Loader from '../../components/Loader/loader'
import '../../App.scss'
import { Link } from 'react-router-dom'

const MyAccount = () => {
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount } = Web3Cntx
  const [getOwnerNamesLoading, setGetOwnerNamesLoading] = useState(false)
  const [ownerDetails, setOwnerDetails] = useState<
    { name: string; expiry: any }[]
  >([])
  const [currentLevel, setCurrentLevel] = useState<string>()
  const [currentXpPoint, setCurrentXpPoint] = useState<BigInt>()
  const [discountPercentage, setDiscountPercentage] = useState(0);

  type LevelKey = 'Newcomer' | 'Explorer' | 'Contributor' | 'Advocate' | 'Pioneer' | 'Visionary';
  const levelToDiscountMap: { [key in LevelKey]: number } = {
    Newcomer: 0,
    Explorer: 10,
    Contributor: 25,
    Advocate: 50,
    Pioneer: 75,
    Visionary: 100,
  };

  const handleGetownerNames = async (address: string) => {
    try {
      setGetOwnerNamesLoading(true)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res: any = await getOwnerNames(address)
      if (!res.error) {
        setOwnerDetails(
          res.response.map((owner: string) => ({
            name: owner + '.link',
            expiry: '',
          })),
        )
        res.response.forEach((name: string, index: number) =>
          handleGetOwnerExpiration(name, index),
        )
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: res.response,
        })
      }
      setGetOwnerNamesLoading(false)
    } catch (error) {
      setGetOwnerNamesLoading(false)
      console.log('Error in fetching owner names ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }
  const handleCurrentLevel = async (address: string) => {
    try {
      const res: any = await getUserLevel(address);
      setCurrentLevel(res.response);
      const level = res.response as LevelKey;
      const discount = levelToDiscountMap[level] || 0;
      setDiscountPercentage(discount);
    } catch (error) {
      console.log('Error in fetching user level ->', error);
      toast({
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };
  const handlecurrentXpPoint = async (address: string) => {
    try {
      const res: any = await getUserXp(address);
      console.log(res.response)
      setCurrentXpPoint(res.response);
    } catch (error) {
      console.log('Error in fetching user level ->', error);
      toast({
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  const handleGetOwnerExpiration = async (address: string, index: number) => {
    try {
      const res: any = await getExpiry(address + '.link')
      console.log(res.response)
      
        setOwnerDetails((prevState) => {
          const newArray = [...prevState]
          newArray[index] = {
            name: address + '.link',
            expiry: res.response.toString()
          }
          return newArray
        })
      
        // toast({
        //   title: 'Error',
        //   variant: 'destructive',
        //   description: res.response,
        // })
    } catch (error) {
      console.log('Error in fetching owner expiry ->', error)
      toast({
        title: 'Error',
        description: (error as Error).message,
      })
    }
  }

  useEffect(() => {
    if (currentAccount) {
      handleGetownerNames(currentAccount)
      handleCurrentLevel(currentAccount)
      handlecurrentXpPoint(currentAccount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount])

  return (
    <div className="w-11/12 lg:w-10/12 mx-auto">
      <div className="text-white text-left font-bold text-sm md:text-xl lg:text-2xl mt-8 mb-5">
      My Account: {currentLevel} Tier (Discount: {discountPercentage}%) - XP Points: {currentXpPoint?.toString()}
      </div>
      <div className="result__container font-medium text-gray-unaryBorder p-6 md:p-8 pb-0">
        {!!ownerDetails.length ? (
          <>
            <div className="flex flex-row justify-between pb-5 md:pb-8 md:text-base text-sm">
              <h3 className="hidden md:block">Registered Domains</h3>
              <h3 className="hidden md:block">Expiry date</h3>
              <h3 className="block md:hidden">All Domains</h3>
            </div>

            {getOwnerNamesLoading ? (
              <div className="py-12">
                <Loader />
              </div>
            ) : (
              <>
                {ownerDetails?.map((owner) => (
                  <div
                    className="border-t-[0.5px] border-[#333336]
                flex flex-col md:flex-row gap-5 justify-between py-5 md:py-8"
                    key={owner.name}
                  >
                    <div className="flex flex-row items-center gap-3 justify-between">
                      <div className="flex flex-row items-center gap-3">
                        <GlobeLogo />
                        <h3 className="text-white md:text-lg text-base">
                        <Link
                        to={`/domain/${owner.name}/details`}>
                          {owner.name}
                        </Link>
                        </h3>
                      </div>
                      <CopyIcon
                        className="copy__button"
                        onClick={() => copyToClipboard(owner.name)}
                      />
                    </div>
                    <div className="flex flex-col gap-3 md:text-base text-sm text-left">
                      <h3 className="text-left block md:hidden">Expiration</h3>
                      <div className="flex flex-row items-center gap-3">
                        {!!owner.expiry ? owner.expiry : <Loader />}
                        {/* TODO - EXTEND TO BE RELEASED NEXT */}
                        {/* <Button onClick={undefined}>Extend</Button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <div className="mt-20 mb-12 text-primary-text md:text-xl text-base font-semibold ">
            {!!currentAccount
              ? 'No registered domain found'
              : 'Please connect your wallet'}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAccount
