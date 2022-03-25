const artzero_nft = {
  CONTRACT_ADDRESS: "5FarkyYRSR2EH9UGhdshFFwSqJL99QtGL1QkeENHLUXW4XkA",
  CONTRACT_ABI: {
    "source": {
      "hash": "0x8265dcb2a7a3a8571cb911c338eaed9bc9cfb4cceedcfd22c3dc3a6475d07476",
      "language": "ink! 3.0.0",
      "compiler": "rustc 1.61.0-nightly"
    },
    "contract": {
      "name": "artzero_nft",
      "version": "1.0.0",
      "authors": [
        "ArtZero <admin@artzero.io>"
      ]
    },
    "V3": {
      "spec": {
        "constructors": [
          {
            "args": [
              {
                "label": "contract_owner",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 8
                }
              },
              {
                "label": "name",
                "type": {
                  "displayName": [
                    "String"
                  ],
                  "type": 22
                }
              },
              {
                "label": "symbol",
                "type": {
                  "displayName": [
                    "String"
                  ],
                  "type": 22
                }
              },
              {
                "label": "total_supply",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              },
              {
                "label": "fee_1",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 6
                }
              },
              {
                "label": "fee_2",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 6
                }
              },
              {
                "label": "amount_1",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              "fee_1: Pre_launch Minting Fee",
              "fee_2: Launch Minting Fee",
              "amount_1: To what amount the fee_1 is applied, after that fee_2",
              "mint_mode 0: not started",
              "mint_mode 1: started until amount_1 reached",
              "mint_mode 2: started until total_supply reached",
              "total_supply: total_supply"
            ],
            "label": "new",
            "payable": false,
            "selector": "0x9bae9d5e"
          }
        ],
        "docs": [],
        "events": [],
        "messages": [
          {
            "args": [
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 8
                }
              },
              {
                "label": "whitelist_amount",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              " Add new whitelist - Only Owner"
            ],
            "label": "add_whitelist",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0xcc9972d4"
          },
          {
            "args": [
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 8
                }
              },
              {
                "label": "whitelist_amount",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              " Update Whitelist Amount - Only Owner"
            ],
            "label": "update_whitelist_amount",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0xf401400a"
          },
          {
            "args": [
              {
                "label": "mint_mode",
                "type": {
                  "displayName": [
                    "u8"
                  ],
                  "type": 2
                }
              }
            ],
            "docs": [
              " Set mint_mode - Only Owner - mint_mode 0: not started - mint_mode 1: started until amount_1 reached - mint_mode 2: started until total_supply reached"
            ],
            "label": "set_mint_mode",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0x3ef57908"
          },
          {
            "args": [
              {
                "label": "fee_1",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 6
                }
              }
            ],
            "docs": [
              " set fee_1: Pre_launch Minting Fee - Only Owner"
            ],
            "label": "set_fee_1",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0x7a029855"
          },
          {
            "args": [
              {
                "label": "fee_2",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 6
                }
              }
            ],
            "docs": [
              " set fee_2: Launch Minting Fee - Only Owner"
            ],
            "label": "set_fee_2",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0xea621f9d"
          },
          {
            "args": [
              {
                "label": "amount_1",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              " set amount_1: To what amount the fee_1 is applied, after that fee_2 - Only Owner"
            ],
            "label": "set_amount_1",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0x4a6f96f4"
          },
          {
            "args": [
              {
                "label": "uri",
                "type": {
                  "displayName": [
                    "String"
                  ],
                  "type": 22
                }
              }
            ],
            "docs": [
              " Change baseURI"
            ],
            "label": "set_base_uri",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0xec403dee"
          },
          {
            "args": [
              {
                "label": "mint_amount",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              " Whitelisted User Creates multiple"
            ],
            "label": "whitelist_mint",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0x2e50fe5f"
          },
          {
            "args": [],
            "docs": [],
            "label": "paid_mint",
            "mutates": true,
            "payable": true,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0xe4daf8b8"
          },
          {
            "args": [
              {
                "label": "token_id",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              " Get URI from token ID"
            ],
            "label": "token_uri",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Vec"
              ],
              "type": 7
            },
            "selector": "0x5b64e66a"
          },
          {
            "args": [],
            "docs": [
              " mint_mode 0: not started - mint_mode 1: started until amount_1 reached - mint_mode 2: started until total_supply reached"
            ],
            "label": "get_mint_mode",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "u8"
              ],
              "type": 2
            },
            "selector": "0xbaf5f593"
          },
          {
            "args": [],
            "docs": [
              " fee_1: Pre_launch Minting Fee"
            ],
            "label": "get_fee_1",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Balance"
              ],
              "type": 6
            },
            "selector": "0x328fa714"
          },
          {
            "args": [],
            "docs": [
              " fee_2: Launch Minting Fee"
            ],
            "label": "get_fee_2",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Balance"
              ],
              "type": 6
            },
            "selector": "0x40acac8d"
          },
          {
            "args": [],
            "docs": [
              " amount_1: To what amount the fee_1 is applied, after that fee_2"
            ],
            "label": "get_amount_1",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "u32"
              ],
              "type": 4
            },
            "selector": "0x33604085"
          },
          {
            "args": [
              {
                "label": "id",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              " Get Whitelist Account by ID"
            ],
            "label": "get_whitelist_account",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "AccountId"
              ],
              "type": 8
            },
            "selector": "0x99c6696f"
          },
          {
            "args": [
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 8
                }
              }
            ],
            "docs": [
              " Get Whitelist Information by AccountID"
            ],
            "label": "get_whitelist",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Whitelist"
              ],
              "type": 20
            },
            "selector": "0x7e5dc19e"
          },
          {
            "args": [],
            "docs": [
              " Get Whitelist Count"
            ],
            "label": "get_whitelist_count",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "u32"
              ],
              "type": 4
            },
            "selector": "0x881eeb32"
          },
          {
            "args": [],
            "docs": [
              "Get total tokens can be mint by whitelisted accounts"
            ],
            "label": "get_whitelist_mint_total_amount",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "u32"
              ],
              "type": 4
            },
            "selector": "0x513a7c7d"
          },
          {
            "args": [
              {
                "label": "token_id",
                "type": {
                  "displayName": [
                    "Id"
                  ],
                  "type": 1
                }
              },
              {
                "label": "attributes",
                "type": {
                  "displayName": [
                    "Vec"
                  ],
                  "type": 25
                }
              },
              {
                "label": "values",
                "type": {
                  "displayName": [
                    "Vec"
                  ],
                  "type": 25
                }
              }
            ],
            "docs": [
              "Only Owner can set multiple attributes to a token"
            ],
            "label": "set_multiple_attributes",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0x8119d25e"
          },
          {
            "args": [
              {
                "label": "token_id",
                "type": {
                  "displayName": [
                    "Id"
                  ],
                  "type": 1
                }
              },
              {
                "label": "attributes",
                "type": {
                  "displayName": [
                    "Vec"
                  ],
                  "type": 25
                }
              }
            ],
            "docs": [],
            "label": "get_attributes",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Vec"
              ],
              "type": 25
            },
            "selector": "0x8d76b3fe"
          },
          {
            "args": [],
            "docs": [
              "Get Attribute Count"
            ],
            "label": "get_attribute_count",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "u32"
              ],
              "type": 4
            },
            "selector": "0x0f130254"
          },
          {
            "args": [
              {
                "label": "index",
                "type": {
                  "displayName": [
                    "u32"
                  ],
                  "type": 4
                }
              }
            ],
            "docs": [
              "Get Attribute Name"
            ],
            "label": "get_attribute_name",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "String"
              ],
              "type": 22
            },
            "selector": "0x560b979d"
          },
          {
            "args": [
              {
                "label": "value",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 6
                }
              }
            ],
            "docs": [
              " Withdraw Fees - only Owner"
            ],
            "label": "withdraw_fee",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 23
            },
            "selector": "0x07fdb555"
          },
          {
            "args": [
              {
                "label": "new_owner",
                "type": {
                  "displayName": [
                    "ownable_external",
                    "TransferOwnershipInput1"
                  ],
                  "type": 8
                }
              }
            ],
            "docs": [],
            "label": "Ownable::transfer_ownership",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ownable_external",
                "TransferOwnershipOutput"
              ],
              "type": 26
            },
            "selector": "0x11f43efd"
          },
          {
            "args": [],
            "docs": [],
            "label": "Ownable::renounce_ownership",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ownable_external",
                "RenounceOwnershipOutput"
              ],
              "type": 26
            },
            "selector": "0x5e228753"
          },
          {
            "args": [],
            "docs": [],
            "label": "Ownable::owner",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ownable_external",
                "OwnerOutput"
              ],
              "type": 8
            },
            "selector": "0x4fa43c8c"
          },
          {
            "args": [
              {
                "label": "to",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "TransferInput1"
                  ],
                  "type": 8
                }
              },
              {
                "label": "id",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "TransferInput2"
                  ],
                  "type": 1
                }
              },
              {
                "label": "data",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "TransferInput3"
                  ],
                  "type": 7
                }
              }
            ],
            "docs": [],
            "label": "PSP34::transfer",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34_external",
                "TransferOutput"
              ],
              "type": 28
            },
            "selector": "0x3128d61b"
          },
          {
            "args": [
              {
                "label": "owner",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "AllowanceInput1"
                  ],
                  "type": 8
                }
              },
              {
                "label": "operator",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "AllowanceInput2"
                  ],
                  "type": 8
                }
              },
              {
                "label": "id",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "AllowanceInput3"
                  ],
                  "type": 14
                }
              }
            ],
            "docs": [],
            "label": "PSP34::allowance",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34_external",
                "AllowanceOutput"
              ],
              "type": 30
            },
            "selector": "0x4790f55a"
          },
          {
            "args": [],
            "docs": [],
            "label": "PSP34::total_supply",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34_external",
                "TotalSupplyOutput"
              ],
              "type": 6
            },
            "selector": "0x628413fe"
          },
          {
            "args": [
              {
                "label": "operator",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "ApproveInput1"
                  ],
                  "type": 8
                }
              },
              {
                "label": "id",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "ApproveInput2"
                  ],
                  "type": 14
                }
              },
              {
                "label": "approved",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "ApproveInput3"
                  ],
                  "type": 30
                }
              }
            ],
            "docs": [],
            "label": "PSP34::approve",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34_external",
                "ApproveOutput"
              ],
              "type": 28
            },
            "selector": "0x1932a8b0"
          },
          {
            "args": [
              {
                "label": "id",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "OwnerOfInput1"
                  ],
                  "type": 1
                }
              }
            ],
            "docs": [],
            "label": "PSP34::owner_of",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34_external",
                "OwnerOfOutput"
              ],
              "type": 31
            },
            "selector": "0x1168624d"
          },
          {
            "args": [
              {
                "label": "owner",
                "type": {
                  "displayName": [
                    "psp34_external",
                    "BalanceOfInput1"
                  ],
                  "type": 8
                }
              }
            ],
            "docs": [],
            "label": "PSP34::balance_of",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34_external",
                "BalanceOfOutput"
              ],
              "type": 4
            },
            "selector": "0xcde7e55f"
          },
          {
            "args": [],
            "docs": [],
            "label": "PSP34::collection_id",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34_external",
                "CollectionIdOutput"
              ],
              "type": 1
            },
            "selector": "0xffa27a5f"
          },
          {
            "args": [
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "psp34burnable_external",
                    "BurnInput1"
                  ],
                  "type": 8
                }
              },
              {
                "label": "id",
                "type": {
                  "displayName": [
                    "psp34burnable_external",
                    "BurnInput2"
                  ],
                  "type": 1
                }
              }
            ],
            "docs": [],
            "label": "PSP34Burnable::burn",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34burnable_external",
                "BurnOutput"
              ],
              "type": 28
            },
            "selector": "0x63c9877a"
          },
          {
            "args": [
              {
                "label": "id",
                "type": {
                  "displayName": [
                    "psp34metadata_external",
                    "GetAttributeInput1"
                  ],
                  "type": 1
                }
              },
              {
                "label": "key",
                "type": {
                  "displayName": [
                    "psp34metadata_external",
                    "GetAttributeInput2"
                  ],
                  "type": 7
                }
              }
            ],
            "docs": [],
            "label": "PSP34Metadata::get_attribute",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "psp34metadata_external",
                "GetAttributeOutput"
              ],
              "type": 32
            },
            "selector": "0xf19d48d1"
          }
        ]
      },
      "storage": {
        "struct": {
          "fields": [
            {
              "layout": {
                "struct": {
                  "fields": [
                    {
                      "layout": {
                        "cell": {
                          "key": "0xca887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                          "ty": 0
                        }
                      },
                      "name": "token_owner"
                    },
                    {
                      "layout": {
                        "cell": {
                          "key": "0xcb887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                          "ty": 11
                        }
                      },
                      "name": "owned_tokens_count"
                    },
                    {
                      "layout": {
                        "cell": {
                          "key": "0xcc887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                          "ty": 12
                        }
                      },
                      "name": "operator_approvals"
                    },
                    {
                      "layout": {
                        "cell": {
                          "key": "0xcd887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                          "ty": 6
                        }
                      },
                      "name": "total_supply"
                    },
                    {
                      "layout": {
                        "enum": {
                          "dispatchKey": "0xce887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                          "variants": {
                            "0": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0xcf887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                                      "ty": 15
                                    }
                                  },
                                  "name": null
                                }
                              ]
                            },
                            "1": {
                              "fields": []
                            }
                          }
                        }
                      },
                      "name": "_reserved"
                    }
                  ]
                }
              },
              "name": "psp34"
            },
            {
              "layout": {
                "struct": {
                  "fields": [
                    {
                      "layout": {
                        "cell": {
                          "key": "0x2378c55a0f00e79375687565b21164fce62724c7b4567f680eb360fbb4f90f50",
                          "ty": 16
                        }
                      },
                      "name": "attributes"
                    },
                    {
                      "layout": {
                        "enum": {
                          "dispatchKey": "0x2478c55a0f00e79375687565b21164fce62724c7b4567f680eb360fbb4f90f50",
                          "variants": {
                            "0": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x2578c55a0f00e79375687565b21164fce62724c7b4567f680eb360fbb4f90f50",
                                      "ty": 15
                                    }
                                  },
                                  "name": null
                                }
                              ]
                            },
                            "1": {
                              "fields": []
                            }
                          }
                        }
                      },
                      "name": "_reserved"
                    }
                  ]
                }
              },
              "name": "metadata"
            },
            {
              "layout": {
                "struct": {
                  "fields": [
                    {
                      "layout": {
                        "cell": {
                          "key": "0x8cd6e4a382bfd8c05974e694dac962833b58a5d56cc64ad5d8451dcbda63b387",
                          "ty": 8
                        }
                      },
                      "name": "owner"
                    },
                    {
                      "layout": {
                        "enum": {
                          "dispatchKey": "0x8dd6e4a382bfd8c05974e694dac962833b58a5d56cc64ad5d8451dcbda63b387",
                          "variants": {
                            "0": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x8ed6e4a382bfd8c05974e694dac962833b58a5d56cc64ad5d8451dcbda63b387",
                                      "ty": 15
                                    }
                                  },
                                  "name": null
                                }
                              ]
                            },
                            "1": {
                              "fields": []
                            }
                          }
                        }
                      },
                      "name": "_reserved"
                    }
                  ]
                }
              },
              "name": "ownable"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "ty": 4
                }
              },
              "name": "total_supply"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0100000000000000000000000000000000000000000000000000000000000000",
                  "ty": 4
                }
              },
              "name": "token_count"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0200000000000000000000000000000000000000000000000000000000000000",
                  "ty": 4
                }
              },
              "name": "attribute_count"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0300000000000000000000000000000000000000000000000000000000000000",
                  "ty": 18
                }
              },
              "name": "attribute_names"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0400000000000000000000000000000000000000000000000000000000000000",
                  "ty": 19
                }
              },
              "name": "whitelists"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0500000000000000000000000000000000000000000000000000000000000000",
                  "ty": 4
                }
              },
              "name": "whitelist_count"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0600000000000000000000000000000000000000000000000000000000000000",
                  "ty": 21
                }
              },
              "name": "whitelist_accounts"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0700000000000000000000000000000000000000000000000000000000000000",
                  "ty": 4
                }
              },
              "name": "whitelist_mint_total_amount"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0800000000000000000000000000000000000000000000000000000000000000",
                  "ty": 6
                }
              },
              "name": "fee_1"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0900000000000000000000000000000000000000000000000000000000000000",
                  "ty": 6
                }
              },
              "name": "fee_2"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0a00000000000000000000000000000000000000000000000000000000000000",
                  "ty": 4
                }
              },
              "name": "amount_1"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0b00000000000000000000000000000000000000000000000000000000000000",
                  "ty": 2
                }
              },
              "name": "mint_mode"
            }
          ]
        }
      },
      "types": [
        {
          "id": 0,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 10,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 1
              },
              {
                "name": "V",
                "type": 8
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 1,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 2,
                        "typeName": "u8"
                      }
                    ],
                    "index": 0,
                    "name": "U8"
                  },
                  {
                    "fields": [
                      {
                        "type": 3,
                        "typeName": "u16"
                      }
                    ],
                    "index": 1,
                    "name": "U16"
                  },
                  {
                    "fields": [
                      {
                        "type": 4,
                        "typeName": "u32"
                      }
                    ],
                    "index": 2,
                    "name": "U32"
                  },
                  {
                    "fields": [
                      {
                        "type": 5,
                        "typeName": "u64"
                      }
                    ],
                    "index": 3,
                    "name": "U64"
                  },
                  {
                    "fields": [
                      {
                        "type": 6,
                        "typeName": "u128"
                      }
                    ],
                    "index": 4,
                    "name": "U128"
                  },
                  {
                    "fields": [
                      {
                        "type": 7,
                        "typeName": "Vec<u8>"
                      }
                    ],
                    "index": 5,
                    "name": "Bytes"
                  }
                ]
              }
            },
            "path": [
              "contracts",
              "traits",
              "psp34",
              "psp34",
              "Id"
            ]
          }
        },
        {
          "id": 2,
          "type": {
            "def": {
              "primitive": "u8"
            }
          }
        },
        {
          "id": 3,
          "type": {
            "def": {
              "primitive": "u16"
            }
          }
        },
        {
          "id": 4,
          "type": {
            "def": {
              "primitive": "u32"
            }
          }
        },
        {
          "id": 5,
          "type": {
            "def": {
              "primitive": "u64"
            }
          }
        },
        {
          "id": 6,
          "type": {
            "def": {
              "primitive": "u128"
            }
          }
        },
        {
          "id": 7,
          "type": {
            "def": {
              "sequence": {
                "type": 2
              }
            }
          }
        },
        {
          "id": 8,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "type": 9,
                    "typeName": "[u8; 32]"
                  }
                ]
              }
            },
            "path": [
              "ink_env",
              "types",
              "AccountId"
            ]
          }
        },
        {
          "id": 9,
          "type": {
            "def": {
              "array": {
                "len": 32,
                "type": 2
              }
            }
          }
        },
        {
          "id": 10,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "type": 9,
                    "typeName": "[u8; 32]"
                  }
                ]
              }
            },
            "path": [
              "ink_primitives",
              "Key"
            ]
          }
        },
        {
          "id": 11,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 10,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 8
              },
              {
                "name": "V",
                "type": 4
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 12,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 10,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 13
              },
              {
                "name": "V",
                "type": 15
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 13,
          "type": {
            "def": {
              "tuple": [
                8,
                8,
                14
              ]
            }
          }
        },
        {
          "id": 14,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "index": 0,
                    "name": "None"
                  },
                  {
                    "fields": [
                      {
                        "type": 1
                      }
                    ],
                    "index": 1,
                    "name": "Some"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 1
              }
            ],
            "path": [
              "Option"
            ]
          }
        },
        {
          "id": 15,
          "type": {
            "def": {
              "tuple": []
            }
          }
        },
        {
          "id": 16,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 10,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 17
              },
              {
                "name": "V",
                "type": 7
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 17,
          "type": {
            "def": {
              "tuple": [
                1,
                7
              ]
            }
          }
        },
        {
          "id": 18,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 10,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 4
              },
              {
                "name": "V",
                "type": 7
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 19,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 10,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 8
              },
              {
                "name": "V",
                "type": 20
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 20,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "whitelist_amount",
                    "type": 4,
                    "typeName": "u32"
                  },
                  {
                    "name": "claimed_amount",
                    "type": 4,
                    "typeName": "u32"
                  }
                ]
              }
            },
            "path": [
              "artzero_nft",
              "artzero_psp34",
              "Whitelist"
            ]
          }
        },
        {
          "id": 21,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 10,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 4
              },
              {
                "name": "V",
                "type": 8
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 22,
          "type": {
            "def": {
              "primitive": "str"
            }
          }
        },
        {
          "id": 23,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 15
                      }
                    ],
                    "index": 0,
                    "name": "Ok"
                  },
                  {
                    "fields": [
                      {
                        "type": 24
                      }
                    ],
                    "index": 1,
                    "name": "Err"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 15
              },
              {
                "name": "E",
                "type": 24
              }
            ],
            "path": [
              "Result"
            ]
          }
        },
        {
          "id": 24,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 22,
                        "typeName": "String"
                      }
                    ],
                    "index": 0,
                    "name": "Custom"
                  },
                  {
                    "index": 1,
                    "name": "NotOwner"
                  },
                  {
                    "index": 2,
                    "name": "NotApproved"
                  },
                  {
                    "index": 3,
                    "name": "TokenExists"
                  },
                  {
                    "index": 4,
                    "name": "TokenNotFound"
                  },
                  {
                    "index": 5,
                    "name": "CannotInsert"
                  },
                  {
                    "index": 6,
                    "name": "CannotFetchValue"
                  },
                  {
                    "index": 7,
                    "name": "NotAllowed"
                  },
                  {
                    "index": 8,
                    "name": "InvalidInput"
                  },
                  {
                    "index": 9,
                    "name": "OnlyAdmin"
                  },
                  {
                    "index": 10,
                    "name": "ClaimedAll"
                  },
                  {
                    "index": 11,
                    "name": "TokenLimitReached"
                  },
                  {
                    "index": 12,
                    "name": "TokenLimitReachedMode1"
                  },
                  {
                    "index": 13,
                    "name": "InvalidFee"
                  },
                  {
                    "index": 14,
                    "name": "NotMintTime"
                  },
                  {
                    "index": 15,
                    "name": "NotEnoughBalance"
                  },
                  {
                    "index": 16,
                    "name": "InvalidMintAmount"
                  }
                ]
              }
            },
            "path": [
              "artzero_nft",
              "artzero_psp34",
              "Error"
            ]
          }
        },
        {
          "id": 25,
          "type": {
            "def": {
              "sequence": {
                "type": 22
              }
            }
          }
        },
        {
          "id": 26,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 15
                      }
                    ],
                    "index": 0,
                    "name": "Ok"
                  },
                  {
                    "fields": [
                      {
                        "type": 27
                      }
                    ],
                    "index": 1,
                    "name": "Err"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 15
              },
              {
                "name": "E",
                "type": 27
              }
            ],
            "path": [
              "Result"
            ]
          }
        },
        {
          "id": 27,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "index": 0,
                    "name": "CallerIsNotOwner"
                  },
                  {
                    "index": 1,
                    "name": "NewOwnerIsZero"
                  }
                ]
              }
            },
            "path": [
              "contracts",
              "traits",
              "errors",
              "ownable",
              "OwnableError"
            ]
          }
        },
        {
          "id": 28,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 15
                      }
                    ],
                    "index": 0,
                    "name": "Ok"
                  },
                  {
                    "fields": [
                      {
                        "type": 29
                      }
                    ],
                    "index": 1,
                    "name": "Err"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 15
              },
              {
                "name": "E",
                "type": 29
              }
            ],
            "path": [
              "Result"
            ]
          }
        },
        {
          "id": 29,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 22,
                        "typeName": "String"
                      }
                    ],
                    "index": 0,
                    "name": "Custom"
                  },
                  {
                    "index": 1,
                    "name": "SelfApprove"
                  },
                  {
                    "index": 2,
                    "name": "NotApproved"
                  },
                  {
                    "index": 3,
                    "name": "TokenExists"
                  },
                  {
                    "index": 4,
                    "name": "TokenNotExists"
                  },
                  {
                    "fields": [
                      {
                        "type": 22,
                        "typeName": "String"
                      }
                    ],
                    "index": 5,
                    "name": "SafeTransferCheckFailed"
                  }
                ]
              }
            },
            "path": [
              "contracts",
              "traits",
              "errors",
              "psp34",
              "PSP34Error"
            ]
          }
        },
        {
          "id": 30,
          "type": {
            "def": {
              "primitive": "bool"
            }
          }
        },
        {
          "id": 31,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "index": 0,
                    "name": "None"
                  },
                  {
                    "fields": [
                      {
                        "type": 8
                      }
                    ],
                    "index": 1,
                    "name": "Some"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 8
              }
            ],
            "path": [
              "Option"
            ]
          }
        },
        {
          "id": 32,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "index": 0,
                    "name": "None"
                  },
                  {
                    "fields": [
                      {
                        "type": 7
                      }
                    ],
                    "index": 1,
                    "name": "Some"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 7
              }
            ],
            "path": [
              "Option"
            ]
          }
        }
      ]
    }
  }
};

export default artzero_nft;
