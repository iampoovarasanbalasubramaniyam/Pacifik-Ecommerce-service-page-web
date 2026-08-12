import sys

def main():
    with open("src/components/products/ProductForm.tsx", "r") as f:
        content = f.read()

    idx_inventory = content.find("              {/* Inventory */}")
    idx_variations = content.find("              {/* Variations */}")
    idx_end_variations = content.find("            <div className={activeTab === 'Advanced' ? 'space-y-8' : 'hidden'}>")
    
    if idx_inventory == -1 or idx_variations == -1 or idx_end_variations == -1:
        print("Could not find markers.")
        sys.exit(1)
        
    # The variations block starts at idx_variations and goes to just before the closing </div> of the General tab.
    # We'll extract it.
    
    # Wait, the closing div of the General tab is right before `idx_end_variations`.
    # Let's find the closing </div> before idx_end_variations.
    idx_closing_div = content.rfind("            </div>", 0, idx_end_variations)
    
    variations_block = content[idx_variations:idx_closing_div]
    
    # Remove the variations block from its current place
    new_content = content[:idx_variations] + content[idx_closing_div:]
    
    # Insert variations_block before Inventory
    # Find new idx_inventory since new_content length changed
    new_idx_inventory = new_content.find("              {/* Inventory */}")
    
    final_content = new_content[:new_idx_inventory] + variations_block + "\n" + new_content[new_idx_inventory:]
    
    with open("src/components/products/ProductForm.tsx", "w") as f:
        f.write(final_content)
    
    print("Variations moved successfully!")

if __name__ == "__main__":
    main()
