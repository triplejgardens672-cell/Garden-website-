// Booking system functionality
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission();
        });
    }
});

// Handle booking form submission
function handleBookingSubmission() {
    const form = document.getElementById('quoteForm');
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        services: getSelectedServices(),
        details: document.getElementById('details').value,
        toolType: document.getElementById('toolType').value || 'None selected',
        hourRate: document.getElementById('hourRate').value || 'Not specified',
        dayRate: document.getElementById('dayRate').value || 'Not specified',
        rentalDates: document.getElementById('rentalDates').value || 'Not specified',
        submissionDate: new Date().toLocaleString()
    };

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
        alert('Please fill in all required fields (First Name, Last Name, Phone, Address).');
        return;
    }

    if (formData.services.length === 0 && !formData.toolType) {
        alert('Please select at least one garden service or a tool to hire.');
        return;
    }

    if (!isValidPhone(formData.phone)) {
        alert('Please enter a valid phone number.');
        return;
    }

    // Send data to server/email
    sendBookingData(formData);
    
    // Show success message
    showSuccessMessage(formData);
    
    // Reset form
    form.reset();
}

// Get selected services from checkboxes
function getSelectedServices() {
    const checkboxes = document.querySelectorAll('input[name="services"]:checked');
    const services = [];
    
    checkboxes.forEach(checkbox => {
        services.push(checkbox.value);
    });
    
    return services;
}

// Validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.trim());
}

// Send booking data to server
function sendBookingData(formData) {
    // Create email body
    const emailBody = formatBookingEmail(formData);
    
    // Log to console (for demonstration)
    console.log('Booking Data:', formData);
    console.log('Email would be sent to: triplejgardens267@gmail.com');
    console.log('Email Body:', emailBody);
    
    // In a production environment, this would send to a backend server
    // which would then send the email to triplejgardens267@gmail.com
    // For now, we'll use a service like FormSubmit or similar
    
    // Alternative: Send via email service using fetch
    sendViaEmailService(formData);
}

// Send via email service (FormSubmit or similar)
function sendViaEmailService(formData) {
    // Using FormSubmit.co service (free email form service)
    const emailData = new FormData();
    emailData.append('_subject', `New Booking Request from ${formData.firstName} ${formData.lastName}`);
    emailData.append('_captcha', 'false');
    emailData.append('Name', `${formData.firstName} ${formData.lastName}`);
    emailData.append('Phone', formData.phone);
    emailData.append('Address', formData.address);
    emailData.append('Services', formData.services.join(', ') || 'None');
    emailData.append('Additional Details', formData.details);
    emailData.append('Tool Type', formData.toolType);
    emailData.append('Hourly Rate', formData.hourRate);
    emailData.append('Daily Rate', formData.dayRate);
    emailData.append('Rental Dates', formData.rentalDates);
    emailData.append('Submission Date', formData.submissionDate);
    
    // Send to FormSubmit (this will forward to your Gmail)
    fetch('https://formsubmit.co/triplejgardens267@gmail.com', {
        method: 'POST',
        body: emailData
    })
    .then(response => {
        if (response.ok) {
            console.log('Booking email sent successfully!');
        } else {
            console.log('Booking saved locally (email service may be unavailable)');
        }
    })
    .catch(error => {
        console.log('Booking saved locally:', error);
    });
}

// Format booking data into email format
function formatBookingEmail(formData) {
    const toolHireInfo = formData.toolType !== 'None selected' ? `
Tool Hire Request:
- Tool Type: ${formData.toolType}
- Hourly Rate: ${formData.hourRate}
- Daily Rate: ${formData.dayRate}
- Rental Dates: ${formData.rentalDates}
` : '';

    return `
NEW BOOKING REQUEST FROM TRIPLE J GARDENS WEBSITE

Customer Information:
- Name: ${formData.firstName} ${formData.lastName}
- Phone: ${formData.phone}
- Address: ${formData.address}

Garden Services Requested:
${formData.services.length > 0 ? formData.services.map(s => `- ${s}`).join('\n') : '- None'}

Additional Details:
${formData.details || 'No additional details provided'}
${toolHireInfo}
Submission Date: ${formData.submissionDate}

---
This is an automated message from the Triple J Gardens website booking system.
`;
}

// Show success message
function showSuccessMessage(formData) {
    const successHTML = `
        <div class="success-modal">
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h2>Booking Request Submitted!</h2>
                <p>Thank you, <strong>${formData.firstName}</strong>!</p>
                <p>Your free quote request has been received.</p>
                <div class="success-details">
                    <p><strong>We'll contact you at:</strong><br>${formData.phone}</p>
                    <p><strong>Estimated Response Time:</strong><br>Within 24 hours</p>
                </div>
                ${formData.toolType !== 'None selected' ? `
                <div class="tool-hire-confirmation">
                    <p>🎉 <strong>Tool Hire Booking Confirmed!</strong></p>
                    <p>We'll include tool hire information in our response.</p>
                </div>
                ` : ''}
                <div class="success-actions">
                    <button onclick="closeSuccessModal()" class="btn btn-primary">Close</button>
                    <a href="https://www.facebook.com/Triple-J-Gardens" target="_blank" class="btn btn-secondary">Follow Us on Facebook</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    
    // Add modal styles if not already present
    if (!document.getElementById('successModalStyles')) {
        const style = document.createElement('style');
        style.id = 'successModalStyles';
        style.textContent = `
            .success-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
            }
            
            .success-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .success-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #90ee90 0%, #7cdc5c 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                color: #2d5016;
                margin: 0 auto 1.5rem;
                font-weight: bold;
            }
            
            .success-content h2 {
                color: #2d5016;
                margin-bottom: 1rem;
            }
            
            .success-content p {
                color: #666;
                margin-bottom: 0.5rem;
            }
            
            .success-details {
                background: #f9f9f9;
                padding: 1.5rem;
                border-radius: 8px;
                margin: 1.5rem 0;
            }
            
            .success-details p {
                margin-bottom: 1rem;
            }
            
            .success-details p:last-child {
                margin-bottom: 0;
            }
            
            .tool-hire-confirmation {
                background: linear-gradient(135deg, #90ee90 0%, #7cdc5c 100%);
                color: #2d5016;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
                font-weight: bold;
            }
            
            .success-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .success-actions .btn {
                flex: 1;
                min-width: 150px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

// Add slideDown animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(30px);
        }
    }
`;
document.head.appendChild(style);

// Store booking count to track free petrol offers
function getBookingCount() {
    const stored = localStorage.getItem('toolHireBookingCount');
    return stored ? parseInt(stored) : 0;
}

function incrementBookingCount() {
    const count = getBookingCount() + 1;
    localStorage.setItem('toolHireBookingCount', count);
    return count;
}

// Check if customer gets free petrol
function checkFreePetrolOffer(formData) {
    if (formData.toolType !== 'None selected') {
        const bookingCount = incrementBookingCount();
        if (bookingCount % 3 === 0) {
            return true;
        }
    }
    return false;
}
