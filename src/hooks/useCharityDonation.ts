import { useState } from "react";
import { charityApi } from "@/services/api/charity";
import { CharityDonationRequest, CharityDonationResponse } from "@/dtos/charity.dto";

export const useCharityDonation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donationResult, setDonationResult] = useState<CharityDonationResponse | null>(null);

  const createDonation = async (donationData: CharityDonationRequest): Promise<CharityDonationResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setDonationResult(null);
      
      const response = await charityApi.createDonation(donationData);
      setDonationResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطایی در ارسال نیکی رخ داد";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetDonation = () => {
    setError(null);
    setDonationResult(null);
  };

  return {
    loading,
    error,
    donationResult,
    createDonation,
    resetDonation,
  };
};

