﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Stripe;
using Stripe.Checkout;

namespace capstone.ViewModels
{
    public class DonationRequest
    {
        public string User { get; set; }
        public string TokenId { get; set; }
        public string Message { get; set; }
        public string Amount { get; set; }
    }
}
